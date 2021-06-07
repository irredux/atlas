#!/user/bin/env python3
# -*- coding: utf-8 -*-
"""buticula.py - modifies bottle.py to send and receive data from dMLW Database

Author: Alexander Häberlin <alexander.haeberlin@mlw.badw.de>

Copyright 2021 Bavarian Academy of Sciences and Humanities

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""
from binascii import hexlify
from configparser import ConfigParser
from datetime import datetime, timedelta, date
from hashlib import pbkdf2_hmac
import html
import json
from operator import itemgetter
from os import path, urandom, mkdir, remove, listdir, rename
import re
from shutil import rmtree, move
import subprocess
import sys
import tempfile
from uuid import uuid4
import zipfile

from dMLW.arachne import Arachne
from dMLW.buticula.bottle import (Bottle, HTTPResponse, HTTPError, abort, redirect, request,
        response, server_names, static_file, template, TEMPLATE_PATH)
from dMLW.tiro import Tiro

class Buticula(Bottle):
    def __init__(self, main_path, cfg_path):
        #load cfg
        cfg = ConfigParser()
        cfg.read(cfg_path)

        # start logger:
        self.Tiro = Tiro(cfg.get('log', 'stream'), cfg.get('log', 'logfile'),
                cfg.get('log', 'lvl'))
        self.Tiro.log("Starting Buticula...")
        super(Buticula, self).__init__()

        # set global vars and methods
        self.p = main_path
        self.p_html = self.p + cfg["default_path"]["html_directory"]
        self.add_view_path(self.p_html + "/views")
        self.Tiro.log(f"\t... main path: {self.p}")
        self.Tiro.log(f"\t... html path: {self.p_html}")
        #self.template = template
        #self.request = request
        self.full_update = "2021-05-31 09:54:00" # local client-sided database

        # set session parameters
        self.s_hours = 4
        self.s_minutes = 0

        # set db
        search_cols = f"{self.p}{cfg['default_path']['search_columns']}"
        access_config = f"{self.p}{cfg['default_path']['access_config']}"
        self.db = Arachne(cfg['database'], self.Tiro, search_cols, access_config)

        # set server
        server_cfg = cfg["connection"]
        if server_cfg.get('host') == 'localhost':
            self.cookie_secure = False
        else:
            self.cookie_secure = True
        server = server_names[server_cfg.get('server')](
                host = server_cfg.get('host'),
                port = server_cfg.get('port'),
                certfile = server_cfg.get('certfile'),
                keyfile = server_cfg.get('keyfile'),
                chainfile = server_cfg.get('chainfile'),
                )
        self.__server_settings = {'server': server,'debug': server_cfg.get('debug')}
        self.Tiro.log(f"\t... server: '{server_cfg['server']}'")
        self.Tiro.log(f"\t... on '{server_cfg['host']}:{server_cfg['port']}'")
        self.Tiro.log(f"\t... SSL: '{server_cfg['https']}'")

        # doublesided zettel
        if server_cfg.get("doublesided") == "True":
            self.doublesided = True
        else:
            self.doublesided = False
        self.Tiro.log(f"\t Doublesided zettel: {self.doublesided}.")

        # load JSON files from /config
        self.Tiro.log(f"\t load color scheme:")
        with open(self.p + "/config/colors.JSON") as colors_file:
            self.color_scheme = json.load(colors_file)
        self.Tiro.log(f"\t color scheme loaded.")

        self.Tiro.log("\t load captions:")
        with open(self.p + "/config/captions.JSON") as captions_file:
            self.captions = json.load(captions_file)
        self.Tiro.log("\t captions loaded.")

        #self.Tiro.log(f"\t load version descriptions:")
        #with open(self.p + "/dMLW/version.JSON") as version_file:
        #    self.main_version = json.load(version_file)
        #self.sub_version = []

        self.Tiro.log(f"\t load main menu")
        with open(self.p + "/config/mainMenu.JSON") as menu_file:
            self.main_menu = json.load(menu_file)

        self.Tiro.log(f"\t load access files")
        with open(self.p + "/config/accessCREATE.JSON") as access_file:
            self.accessCREATE = json.load(access_file)
        with open(self.p + "/config/accessREAD.JSON") as access_file:
            self.accessREAD = json.load(access_file)
        with open(self.p + "/config/accessUPDATE.JSON") as access_file:
            self.accessUPDATE = json.load(access_file)
        with open(self.p + "/config/accessDELETE.JSON") as access_file:
            self.accessDELETE = json.load(access_file)
        with open(self.p + "/config/objectStores.JSON") as config_file:
            self.oStores = json.load(config_file)

        # write opera sheets
        self.create_opera()

        # write db setups
        #self.presetTbls = ["lemma", "zettel", "scan", "scan_lnk"]
        #for tbl in self.presetTbls:
        #    self.create_db_setup(tbl)

        self.Tiro.log("\tButicula started.")
    # ################################################################
    # -I- routes
    # ################################################################
        # open argos 
        self.route("/", callback=self.site)
        self.route("/site", callback=self.site)
        self.route("/site/<res>", callback=self.site)
        self.route("/site/<res>/<res_id>", callback=self.site)

        # config
        self.route("/config/<res>", callback=self.config_read, method="GET")

        # session
        self.route("/session", callback=self.session_create, method="POST");
        self.route("/session", callback=self.session_read, method="GET");
        self.route("/session", callback=self.session_delete, method="DELETE");

        # info 
        self.route("/info/<res>", callback=self.info_read, method="GET")

        # data
        self.route("/data_batch/<res>", callback=self.data_batch, method="POST")
        self.route("/data_batch/<res>", callback=self.data_batch, method="PATCH")
        self.route("/data_batch/<res>", callback=self.data_batch, method="DELETE")

        self.route("/data/user", callback=self.user_create, method="POST")
        self.route("/data/user/<id:int>", callback=self.user_update, method="PATCH")

        self.route("/data/<res>", callback=self.data_create, method="POST")
        self.route("/data/<res>", callback=self.data_read, method="GET")
        self.route("/data/<res>/<res_id:int>", callback=self.data_read, method="GET")
        self.route("/data/<res>/<res_id:int>", callback=self.data_update, method="PATCH")
        self.route("/data/<res>/<res_id:int>", callback=self.data_delete, method="DELETE")

        # files
        self.route("/file/zettel", callback=self.zettel_import, method="POST")
        self.route("/file/<res>/<res_id>", callback=self.file_read)

        # functions
        self.route("/exec/<res>", callback=self.exec_on_server, method="GET");
        self.route("/exec/<res>", callback=self.exec_on_server, method="POST");

        # OLD ROUTES!
        self.route("/export_project/<mlw_file>", callback=self.f_mlw)
        self.route("/zettel/<letter>/<dir_nr>/<img>", callback=self.f_zettel)

    # ################################################################
    # -II- assorted methods
    # ################################################################
    def create_db_setup(self, table):
        results = self.db.command(f"SELECT * FROM {table} WHERE u_date > '2020-01-01 01:00:00' ORDER BY u_date ASC");
        if path.exists(self.p+"/temp") == False: mkdir(self.p+"/temp")
        with open(self.p + f"/temp/{table}.txt", "w") as i_file:
            i_file.write(json.dumps(results, default=str))

    def create_mlw_file(self, i_data):
        with open(self.p + "/MLW-Software/input.mlw", "wb") as i_file:
            i_file.write(i_data)
        #server_status = subprocess.run(f"python {self.p}/MLW-Software/MLWServer.py --status", shell=True)
        #print("SERVER STATUS:", server_status)
        subprocess.run(f"python {self.p}/MLW-Software/MLWServer.py --startserver&", shell=True)
        if path.exists(self.p + "/MLW-Software/Ausgabe"):
            rmtree(self.p + "/MLW-Software/Ausgabe");
        subprocess.run(
                f"python {self.p}/MLW-Software/MLWServer.py {self.p}/MLW-Software/input.mlw",
                shell=True)
        subprocess.run(f"python {self.p}/MLW-Software/MLWServer.py --stopserver", shell=True)
        o_data = {}
        with open(self.p + "/MLW-Software/Ausgabe/HTML-Vorschau/input.html", "r") as html_file:
            o_data["html"] = html_file.read()
        with open(self.p + "/MLW-Software/Ausgabe/Fehlermeldungen_fuer_die_Autoren/input.txt", "r") as err_file:
            o_data["err"] = err_file.read()
        return json.dumps(o_data)

    def add_view_path(self, path):
        # used in secondary version
        TEMPLATE_PATH.insert(0, path)

    def auth(self, access = ["auth"], logout = False):
        c_session = request.headers.get("Authorization")
        if c_session == "" or c_session == None: abort(401) # unauthorized
        c_session = c_session[7:]

        usr_i = self.db.search("user", {"session": c_session}, ["id", "first_name",
            "last_name", "email", "session_last_active", "access", "settings", "password"])

        if len(usr_i) == 1:
            u_last = usr_i[0].get("session_last_active")
            u_access = set(json.loads(usr_i[0].get("access")))
            session_max = timedelta(hours=self.s_hours, minutes=self.s_minutes)
            update_after = timedelta(hours=0, minutes=10)
            if (session_max >= (datetime.now() - u_last) and logout == False and
                    set(access).issubset(u_access)):
                # session ok
                if update_after <= (datetime.now() - u_last):
                    self.db.save("user", {"session_last_active": datetime.now()},
                            usr_i[0].get("id"))
                usr_i[0]["access"] = json.loads(usr_i[0]["access"])
                return usr_i[0]
            else:
                # session is too old or logout
                self.db.save("user", {"session": ""}, usr_i[0].get("id"))
                abort(401) # unauthorized
        else:
            # more than one user found?!
            abort(401) # unauthorized

    def create_opera(self, user=None):
        self.create_opera_sheet_mai()
        self.create_opera_sheet_min()

    def create_opera_sheet_mai(self):
        with open(self.p + '/html/views/opera/opera_mai_sheet.tpl', 'w+') as sheet_file:
            pass
        with open(self.p + '/html/views/opera/opera_mai_sheet.tpl', 'w+') as sheet_file:
            opera = self.db.search('opera_table_view', {'work_is_maior': 1, 'deleted': 'NULL'}, ['id',
                'author_id', 'work_abbr', 'author_abbr', 'work_full', 'author_full',
                'work_date_display', 'author_date_display', 'work_bibliography',
                'work_txt_info', 'author_txt_info', 'work_citation', 'editions',
                'work_in_use', 'author_in_use', 'work_reference'],
                ['author_abbr_sort', 'work_abbr_sort'])
            current_author = -1
            row_count = 0
            sheet_count = 1
            sheet_file.write('<div id="opera_1"><table><tr><th>Datum')
            sheet_file.write('</th><th>Abkürzung</th><th>Bezeichung</th><th>')
            sheet_file.write('Editionen</th><th>Kommentar</th></tr>')
            nr = -1
            for opus in opera:
                nr+=1
                if current_author != opus['author_id']:
                    row_count += 1
                    current_author = opus['author_id']
                    work_class = " work" if opus.get('work_abbr', '') == '' else ""
                    sheet_file.write(f'<tr class="opera author{work_class}" id="o{nr}" data-author_id="{opus.get("author_id", 0)}"')
                    if opus.get('work_abbr', '') == '':
                        sheet_file.write(f'data-work_id="{opus.get("id", 0)}">')
                    else:
                        sheet_file.write('data-work_id="0">')
                    if opus.get('work_abbr', '') == '':
                        sheet_file.write(f'<td class="c1">{opus.get("work_date_display", "")}</td>')
                    else:
                        sheet_file.write(f'<td class="c1">{opus.get("author_date_display", "")}</td>')
                    c_author_abbr = opus['author_abbr']
                    if opus.get('author_in_use', False) == False:
                        c_author_abbr = f'[{c_author_abbr}]'
                    sheet_file.write('<td class="c2">')
                    sheet_file.write(f'<aut>{c_author_abbr}</aut></td>')
                    sheet_file.write(f'<td class="c3">{opus.get("author_full", "")}')
                    if opus.get('work_abbr', '') == '':
                        if opus.get("work_reference", False):
                            sheet_file.write(f' v. {opus["work_reference"]}</td>')
                        else:
                            sheet_file.write('</td>')
                        sheet_file.write(f'<td class="c4">{opus.get("work_bibliography", "")}')
                        if opus.get('editions', '') != '':
                            editions = json.loads(opus['editions'])
                            for edition in editions:
                                sheet_file.write(f'<br /><a href="{edition["url"]}"')
                                sheet_file.write(f' target="_blank">{edition["label"]}</a>"')
                        sheet_file.write(f'</td><td class="c5">{opus.get("work_citation", "")} ')
                        sheet_file.write(f'{opus.get("work_txt_info", "")}</td></tr>')
                    else:
                        sheet_file.write('</td><td class="c4"></td>')
                        sheet_file.write(f'<td class="c5">{opus.get("author_txt_info", "")}</td></tr>')
                if row_count > 17:
                    row_count = 0
                    sheet_count += 1
                    sheet_file.write(f'</table></div><div id="opera_{sheet_count}"><table>')

                if opus.get('work_abbr', '') != '':
                    nr+=1
                    row_count += 1
                    sheet_file.write(f'<tr  class="work opera" id="o{nr}" data-author_id="0" data-work_id="{opus.get("id", 0)}">')
                    sheet_file.write(f'<td class="c1">{opus.get("work_date_display", "")}</td>')
                    if opus.get('work_in_use', False):
                        sheet_file.write(f'<td class="c2">&nbsp;&nbsp;&nbsp;{opus.get("work_abbr", "")}</td>')
                    else:
                        sheet_file.write(f'<td class="c2">&nbsp;&nbsp;&nbsp;[{opus.get("work_abbr", "")}]</td>')
                    sheet_file.write(f'<td class="c3">&nbsp;&nbsp;&nbsp;{opus.get("work_full", "")}')
                    if opus.get("work_reference", False):
                        sheet_file.write(f' v. {opus.get("work_reference", "")}')
                    sheet_file.write('</td><td class="c4">')
                    sheet_file.write(f'{opus.get("work_bibliography", "")}')
                    if opus.get('editions', None) != None:
                        editions = json.loads(opus['editions'])
                        for edition in editions:
                            sheet_file.write(f'<br /><a href="{edition["url"]}" target="_blank">{edition["label"]}</a>')
                    sheet_file.write('</td><td class="c5">')
                    sheet_file.write(f'{opus.get("work_citation", "")} {opus.get("work_txt_info", "")}</td></tr>\n')
                if row_count > 17:
                    row_count = 0
                    sheet_count += 1
                    sheet_file.write(f'</table></div><div id="opera_{sheet_count}"><table>')
            sheet_file.write('</table></div>')

    def create_opera_sheet_min(self):
        with open(self.p + '/html/views/opera/opera_min_sheet.tpl', 'w+') as sheet_file:
            pass
        with open(self.p + '/html/views/opera/opera_min_sheet.tpl', 'w+') as sheet_file:
            opera = self.db.search('opera_table_view', {'work_is_maior': 0, 'deleted': 'NULL'}, ['id',
                'author_id', 'work_date_display', 'editions', 'opus', 'work_txt_info'],
                ['author_abbr_sort', 'work_abbr_sort'])
            row_count = 0
            sheet_count = 1
            sheet_file.write('<div id="opera_1"><table><tr><th>Datum</th>')
            sheet_file.write('<th>Zitierweise</th><th>Kommentar</th></tr>')
            nr = -1
            for opus in opera:
                nr += 1
                row_count += 1
                sheet_file.write(f'<tr class="work author opera" id="o{nr}" data-author_id="{opus.get("author_id", 0)}" data-work_id="{opus.get("id", 0)}">')
                sheet_file.write(f'<td class="c1_min">{opus.get("work_date_display", "")}</td>')
                sheet_file.write(f'<td class="c2_min">{opus.get("opus", "").replace(" <cit></cit> ( <cit_bib></cit_bib>)", "")}</td>')
                sheet_file.write(f'<td class="c5_min">{opus.get("work_txt_info", "")}')
                if opus.get('editions', None) != None:
                    editions = json.loads(opus['editions'])
                    for edition in editions:
                        sheet_file.write(f'<br /><a href="{edition["url"]}" target="_blank">{edition["label"]}</a>')
                sheet_file.write('</td></tr>')
                if row_count > 17:
                    row_count = 0
                    sheet_count += 1
                    sheet_file.write(f'</table></div><div id="opera_{sheet_count}"><table>')
            sheet_file.write('</table></div>')

    def login_check(self, user, pw):
        user_login = self.db.search("user", {"email": user}, ["id", "password",
            "session", "access", "session_last_active"])
        if (len(user_login) == 1 and "auth" in user_login[0]["access"] and
                self.pw_check(user_login[0]["password"], pw)):
            return user_login[0]
        else:
            return None

    def pw_check(self, pw_db, pw_input):
        salt = pw_db[:64]
        pw_input = pbkdf2_hmac("sha512",
                pw_input.encode("utf-8"),
                salt.encode("ascii"), 100000)
        if pw_db[64:] == hexlify(pw_input).decode("ascii"):
            return True
        else:
            return False

    def pw_set(self, pw_raw):
        salt = hexlify(urandom(32))
        key = pbkdf2_hmac("sha512", pw_raw.encode("utf-8"), salt, 100000)
        key = hexlify(key)
        return (salt+key).decode("ascii")

    def run(self):
        # modifying 'run' method
        #self.__server_settings["reloader"] = True
        super(Buticula, self).run(**self.__server_settings)

    def zettel_delete(self, zettel):
        # removes imgs from directory
        if zettel.get("img_folder", None) != None and zettel.get("sibling", None) == None:
            remove(f"{self.p}/zettel/{zettel['letter']}/{zettel['img_folder']}/{zettel['id']}.jpg")
            if self.doublesided == True:
                remove(f"{self.p}/zettel/{zettel['letter']}/{zettel['img_folder']}/{zettel['id']}v.jpg")

    def zettel_import(self):
        # uploading images for zettel-db
        user = self.auth();
        u_letter = request.forms.letter
        if len(u_letter) == 1 and u_letter.isalpha() and "z_add" in user["access"]:
            u_type = request.forms.type
            # checking and creating path to new files
            f_path = self.p + "/zettel/"
            if path.exists(f_path) == False: mkdir(f_path)
            f_path += f"{u_letter}/"
            if path.exists(f_path) == False: mkdir(f_path)

           # set user_id for first editor
            c_user_id = user['id']
            if 'admin' in user['access'] and request.forms.user_id_id != '':
                c_user_id = request.forms.user_id_id

           # loop through file-list
            recto = True
            if self.doublesided == True:
                max_files = 500
            else:
                max_files = 1000
            c_path = ""
            new_id = 0
            c_loop = 0
            f_lst = request.files.getall("files")
            print(len(f_lst))
            for f in f_lst:
                c_loop += 1
                if recto:
                    # create entry in db
                    save_dict = {
                            "user_id": c_user_id,
                            "letter": u_letter,
                            "created_by": c_user_id,
                            "in_use": True
                            }
                    if u_type != "0":
                        save_dict["type"] = u_type
                    new_id = self.db.save("zettel", save_dict)
                    self.db.save("zettel", {
                        "img_folder": f"{(new_id-1)//max_files}",
                        "img_path": f"/zettel/{u_letter}/{(new_id-1)//max_files}/{new_id}"
                        },
                            new_id)
                    # create subfolder so that no folder has more than 1'000 files
                    c_path = f_path + f"{(new_id-1)//max_files}/"
                    if path.exists(c_path) == False: mkdir(c_path)
                    # save the file
                    f.save(c_path + f"{new_id}.jpg")
                    ##rename(input_path + f, c_path + f"{new_id}.jpg")
                    if self.doublesided: recto = False
                else:
                    ##rename(input_path + f, c_path + f"{new_id}v.jpg")
                    f.save(c_path + f"{new_id}v.jpg")
                    recto = True
            return HTTPResponse(status=201) # created
        else:
            return HTTPResponse(status=400) # bad request

    # ################################################################
    # -III- REST requests
    # ################################################################
    def user_create(self):
        user = {"first_name": request.json["first_name"],
                "last_name": request.json["last_name"],
                "email": request.json["email"],
                "password": request.json["password"],
                "access": []}
        if (user["first_name"] != "" and user["last_name"] != "" and
                user["email"] != "" and user["password"] != ""):
            c_email = self.db.search("user", {"email": user["email"]}, ["id"])
            if len(c_email) == 0:
                user["password"] = self.pw_set(user["password"])
                self.db.save("user", user)
                return HTTPResponse(status=201) # CREATED
            else:
                return HTTPResponse(status=409) # CONFLICT
        else:
            return HTTPResponse(status=406) # NOT ACCEPTABLE

    def user_update(self, id):
        user = self.auth()
        n_access = request.json.get("access", None)
        o_password = request.json.get("old_password", None)
        n_password = request.json.get("new_password", None)
        n_first_name = request.json.get("first_name", None)
        n_last_name = request.json.get("last_name", None)
        n_email = request.json.get("email", None)

        if n_access != None and "admin" in user["access"]:
            self.db.save("user", {"access": n_access}, id)
            return HTTPResponse(status=200) # OK
        elif n_email != None and id == user["id"]:
            self.db.save("user", {"email": n_email, "first_name": n_first_name,
                "last_name": n_last_name}, id)
            return HTTPResponse(status=200) # OK
        elif (n_password != None and o_password != None and
                id == user["id"] and self.pw_check(user["password"], o_password)):
            self.db.save("user", {"password": pw_set(n_password)}, id)
            return HTTPResponse(status=200) # OK
        else:
            return HTTPResponse(status=404)

    def exec_on_server(self, res):
        user = self.auth()
        if res == "opera_update" and "o_edit" in user["access"]:
            self.create_opera()
            return HTTPResponse(status=200) # OK
        elif res == "library_update" and "l_edit" in user["access"]:
            self.db.command("CALL update_library")
            self.create_opera()
            return HTTPResponse(status=200) # OK
        elif res == "mlw_preview" and "editor" in user["access"]:
            return self.create_mlw_file(request.body.read())
        else: return HTTPResponse(status=404) # not found 


    def session_read(self):
        user = self.auth()
        r_user = {
                "id": user["id"],
                "first_name": user["first_name"],
                "last_name": user["last_name"],
                "email": user["email"]
                }
        return json.dumps(r_user);

    def session_create(self):
        email = request.json.get("user", "")
        password = request.json.get("password", "")
        if email != "" and password != "":
            user_login = self.login_check(email, password)
            if user_login != None:
                new_key = str(uuid4())
                data = {"session": new_key,
                        "session_last_active": str(datetime.now()),
                        "agent":request.headers.get('User-Agent')
                        }
                self.db.save("user", data, user_login["id"])
                return data["session"]
            else: return HTTPResponse(status=401) # unauthorized
        else: return HTTPResponse(status=401) # unauthorized

    def session_delete(self):
        user = self.auth()
        self.db.save("user", {"session": ""}, user["id"])
        return HTTPResponse(status=200)


    def config_read(self, res):
        user = self.auth()
        if res=="oStores":
            r_stores = []
            for store in self.oStores:
                for permission in self.accessREAD[store["name"]]:
                    if permission["access"] in user["access"]:
                        r_stores.append(store)
                        break
            return json.dumps(r_stores)
        elif res == "access": return json.dumps(user["access"])
        elif res == "menu":
            user_menu = []
            for key, menu in self.main_menu.items():
                if menu["access"] == "*" or menu["access"] in user["access"]:
                    nItems = []
                    for subMenu in menu["items"]:
                        if subMenu.get("access", "*") == "*" or subMenu.get("access") in user["access"]:
                            nItems.append(subMenu);
                    if len(nItems) != 0: user_menu.append([key, nItems])
            return json.dumps(user_menu);
        elif res == "server_stats":
            server_stats = {
                    "author": [
                        self.db.command(f"SELECT MAX(u_date) AS r FROM author")[0]["r"],
                        self.db.command(f"SELECT COUNT(*) AS r FROM author WHERE deleted IS NULL")[0]["r"]
                        ],
                    "work": [
                        self.db.command(f"SELECT MAX(u_date) AS r FROM work")[0]["r"],
                        self.db.command(f"SELECT COUNT(*) AS r FROM work WHERE deleted IS NULL")[0]["r"]
                        ],
                    "lemma": [
                        self.db.command(f"SELECT MAX(u_date) AS r FROM lemma")[0]["r"],
                        self.db.command(f"SELECT COUNT(*) AS r FROM lemma WHERE deleted IS NULL")[0]["r"]
                        ],
                    "zettel": [
                        self.db.command(f"SELECT MAX(u_date) AS r FROM zettel")[0]["r"],
                        self.db.command(f"SELECT COUNT(*) AS r FROM zettel WHERE deleted IS NULL")[0]["r"]
                        ]
                    }
            return json.dumps(server_stats, default=str)
        else: return HTTPResponse(status=404) # not found

    def info_read(self, res, res_id=None):
        user = self.auth()

        if res not in self.accessREAD.keys(): return HTTPResponse(status=404) # not found
        for permission in self.accessREAD[res]:
            if permission["access"] in user["access"]:
                if permission.get("restricted", "") == "user_id":
                    pass
                break
        else:
            return HTTPResponse(status=403) # forbidden
        if res_id == None:
            max_date = self.db.command(f"SELECT MAX(u_date) FROM {res} WHERE deleted IS NOT NULL")[0]["MAX(u_date)"];
            length = self.db.command(f"SELECT COUNT(*) FROM {res} WHERE deleted IS NOT NULL")[0]["COUNT(*)"];
            return json.dumps({
                "max_date": max_date,
                "length": length
                }, default=str)
        else:
            u_date = self.db.command(f"SELECT u_date FROM {res} WHERE id = {res_id}");
            return u_date

    def data_batch(self, res):
        data = request.json
        if request.method == "POST":
            for d in data:
                re = self.data_create(res, d)
                if(re.status_code != 201):
                    return HTTPResponse(status=400) # error 
                    break
            else:
                return HTTPResponse(status=201) # created
        elif request.method == "PATCH":
            #def data_update(self, res, res_id):
            pass
        elif request.method == "DELETE":
            #def data_delete(self, res, res_id):
            pass
        else:
            return HTTPResponse(status=400) # bad request

    def data_create(self, res, inData=None):
        user = self.auth()
        if res not in self.accessCREATE.keys(): return HTTPResponse(status=404) # not found
        for permission in self.accessCREATE[res]:
            if permission["access"] in user["access"]:
                if inData == None: inData = request.json
                if permission.get("restricted", "") == "user_id":
                    inData["user_id"] = user["id"]
                break
        else:
            return HTTPResponse(status=403) # forbidden

        r_id = self.db.save(res, inData)
        return HTTPResponse(status=201, body=str(r_id)) # created 

    def data_read(self, res, res_id=None):
        user = self.auth()

        if res not in self.accessREAD.keys(): return HTTPResponse(status=404) # not found
        r_cols = "";
        v_cols = [];
        user_id = "";
        for permission in self.accessREAD[res]:
            if permission["access"] in user["access"]:
                if permission.get("restricted", "") == "user_id":
                    if res != "user": user_id = f" user_id = %s AND"
                    else: user_id = f" id = %s AND"
                    v_cols.append(user['id'])
                r_cols = permission["r_cols"]
                break
        else:
            return HTTPResponse(status=403) # forbidden
        if res_id == None:
            u_date = request.query.get("u_date", "2020-01-01 01:00:00")
            v_cols.append(u_date);
            #if u_date == "2020-01-01 01:00:00" and res in self.presetTbls:
            #    with open(self.p + f"/temp/{res}.txt", "r") as i_file:
            #        r_txt = i_file.read()
            #    return r_txt
            #else:
            #    results = self.db.command(f"SELECT {r_cols} FROM {res} WHERE{user_id} u_date > %s ORDER BY u_date ASC", v_cols);
            #    return json.dumps(results, default=str)
            results = self.db.command(f"SELECT {r_cols} FROM {res} WHERE{user_id} u_date > %s ORDER BY u_date ASC LIMIT 10000", v_cols);
            return json.dumps(results, default=str)
        else:
            v_cols.append(res_id);
            results = self.db.command(f"SELECT {r_cols} FROM {res} WHERE{user_id} id = %s", v_cols);
            return json.dumps(results, default=str)

    def data_update(self, res, res_id):
        user = self.auth()
        if res not in self.accessUPDATE.keys(): return HTTPResponse(status=404) # not found
        for permission in self.accessUPDATE[res]:
            if permission["access"] in user["access"]:
                inData = request.json
                if permission.get("restricted", "") == "user_id":
                    if user["id"] == self.db.search(res, {"id": res_id}, ["user_id"])[0]["user_id"]:
                        break
                else:
                    break
        else:
            return HTTPResponse(status=403) # forbidden
        r_id = self.db.save(res, inData, res_id)
        return HTTPResponse(status=200) # ok 

    def data_delete(self, res, res_id):
        user = self.auth()
        if res not in self.accessDELETE.keys(): return HTTPResponse(status=404) # not found
        for permission in self.accessDELETE[res]:
            if permission["access"] in user["access"]:
                if permission.get("restricted", "") == "user_id":
                    if user["id"] == self.db.search(res, {"id": res_id}, ["user_id"])[0]["user_id"]:
                        break
                else:
                    break
        else:
            return HTTPResponse(status=403) # forbidden
        r_id = self.db.save(res, {"deleted": 1}, res_id)
        return HTTPResponse(status=200) # ok 

    def file_read(self, res, res_id):
        if res == "css":
            return static_file(res_id, root=self.p_html + "/css/")
        if res == "js":
            return static_file(res_id, root=self.p_html + "/js/")
        if res == "scan":
            user = self.auth()
            if "library" in user["access"]:
                page = self.db.search("scan", {"id": res_id}, ["path", "filename"])[0]
                return static_file(page["filename"]+".png", root=self.p + "/content/scans/" + page["path"])
            else: return HTTPResponse(status=401)

    def site(self, res = None, res_id = None):
        if res == "opera":
            #user = self.auth()
            if res_id == "mai":
                return template("opera/opera_mai_sheet")
            elif res_id == "min":
                return template("opera/opera_min_sheet")
        else:
            return template("index", captions=self.captions["index"],
                    colors=self.color_scheme, user=None, full_update=self.full_update)

    # ################################################################
    # -IV- file requests
    # ################################################################
    def f_mlw(self, mlw_file):
        user = self.auth()
        if "editor" in user["access"]:
            # CHECK HERE, IF USER IS ALLOWED TO DOWNLOAD PROJECT
            return static_file(mlw_file, root=self.p + "/export_project/")

    def f_zettel(self, letter, dir_nr, img):
        #self.auth()
        return static_file(img, root=self.p + f"/zettel/{letter}/{dir_nr}")
