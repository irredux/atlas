#!/user/bin/env python3
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
import sys
from uuid import uuid4
import zipfile

from dMLW.arachne import Arachne
from dMLW.buticula.bottle import (Bottle,
        HTTPResponse,
        redirect,
        request,
        response,
        server_names,
        static_file,
        template,
        TEMPLATE_PATH,
        )
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
        self.template = template
        self.request = request

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

        self.Tiro.log(f"\t load version descriptions:")
        with open(self.p + "/dMLW/version.JSON") as version_file:
            self.main_version = json.load(version_file)
        self.sub_version = []

        self.Tiro.log(f"\t load main menu")
        with open(self.p + "/config/mainMenu.JSON") as menu_file:
            self.main_menu = json.load(menu_file)

        self.Tiro.log(f"\t load dockers")
        with open(self.p + "/config/dockerPage.JSON") as docker_file:
            self.dockerPage = json.load(docker_file)
        with open(self.p + "/config/dockerData.JSON") as docker_file:
            self.dockerData = json.load(docker_file)
        with open(self.p + "/config/dockerDataDelete.JSON") as docker_file:
            self.dockerDataDelete = json.load(docker_file)

        # write opera sheets
        self.create_opera()

        # stores functions and methods which are executed with data_get and data_update
        self.dataFunctions = {
                "opera_update": self.create_opera,
                "project_export": self.project_export,
                "article_position": self.project_calculate_article_position
                }

        self.Tiro.log("\tButicula started.")
    # ################################################################
    # -I- routes
    # ################################################################
        # files
        self.route("/content/videos/<video_file>", callback=self.f_video)
        self.route("/css/<css_file>", callback=self.f_css)
        self.route("/js/<js_file>", callback=self.f_js)
        self.route("/export_project/<mlw_file>", callback=self.f_mlw)
        self.route("/zettel/<letter>/<dir_nr>/<img>", callback=self.f_zettel)

        # login and account
        self.route("/", callback=self.index)
        self.route("/", callback=self.index, method="POST")
        self.route("/logout", callback=self.logout)
        self.route("/account_create", callback=self.account_create)
        self.route("/account_create", callback=self.account_create, method="POST")

        # system routes
        self.route("/batch", callback=self.data_batch, method="POST")
        self.route("/data/<res>", callback=self.data_get, method="GET") # GET JSON 
        self.route("/data/<res>/<res_id:int>", callback=self.data_get, method="GET") # GET JSON
        self.route("/data/<res>", callback=self.data_create, method="POST")
        self.route("/data/<res>", callback=self.data_update, method="PUT") # not used to create
        self.route("/data/<res>/<res_id:int>", callback=self.data_update, method="PUT") # not used to create
        self.route("/data/<res>/<res_id:int>", callback=self.data_delete, method="DELETE")
        self.route("/page/<res>", callback=self.page, method="GET")
        self.route("/page/<res>/<res_id:int>", callback=self.page, method="GET")

        # OLD ROUTES!
        self.route("/module", callback=self.module, method="POST")
        self.route("/library_viewer", callback=self.library_viewer)
        self.route("/library_edition/<page_id:int>", callback=self.library_edition)
        #self.route("/opera/export/<lst_type>", callback=self.opera_export)
    # ################################################################
    # -II- assorted methods
    # ################################################################
    def add_view_path(self, path):
        # used in secondary version
        TEMPLATE_PATH.insert(0, path)

    def auth(self, access = ["auth"], start = False, logout = False):
        c_session = request.get_cookie("mlw_session", "-1")
        reset_route = True
        usr_o = None
        usr_i = self.db.search("user", {"session": c_session}, ["id", "first_name",
            "last_name", "email", "session_last_active", "access", "settings", "password",
            "show_raw", "order_by_id"])

        if len(usr_i) == 1:
            u_last = usr_i[0].get("session_last_active")
            u_access = set(json.loads(usr_i[0].get("access")))
            session_max = timedelta(hours=self.s_hours, minutes=self.s_minutes)
            update_after = timedelta(hours=0, minutes=10)
            if (session_max >= (datetime.now() - u_last) and
                    logout == False and
                    set(access).issubset(u_access)):
                # session ok
                if update_after <= (datetime.now() - u_last):
                    self.db.save("user", {"session_last_active": datetime.now()},
                            usr_i[0].get("id"))
                usr_o = usr_i[0]
                reset_route = False
            else:
                # session is too old or logout
                self.db.save("user", {"session": ""}, usr_i[0].get("id"))

        if reset_route:
            response.set_cookie("mlw_session", "", secure=self.cookie_secure)
            if start:
                return None
            else:
                if request.path != '/logout':
                    redirect(f"/?href={request.path}")
                else:
                    redirect("/")
        else:
            if "settings" not in usr_o.keys():
                usr_o["settings"] = []
            usr_o["access"] = json.loads(usr_o["access"])
            return usr_o

    def create_opera(self, user=None):
        self.create_opera_sheet_mai()
        self.create_opera_sheet_min()

    def create_opera_sheet_mai(self):
        with open(self.p + '/html/views/opera/opera_mai_sheet.tpl', 'w+') as sheet_file:
            pass
        with open(self.p + '/html/views/opera/opera_mai_sheet.tpl', 'w+') as sheet_file:
            opera = self.db.search('opera_table_view', {'work_is_maior': 1}, ['id',
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
                    if opus.get('editions', '') != '':
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
            opera = self.db.search('opera_table_view', {'work_is_maior': 0}, ['id',
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
                if opus.get('editions', '') != '':
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
        if (len(user_login) == 1 and
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
        super(Buticula, self).run(**self.__server_settings)

    def project_calculate_article_position(self, user):
        # calculates new position of child/sibling articles when article-position is changed.
        project_id = request.json["project_id"]
        old_position = request.json["old_position"]
        new_position = request.json["new_position"]
        article_type = request.json.get("type")
        articles = self.db.search('article', {'project_id': project_id},
                ['id', 'position'], ['position'])
        # 1. separate the lists
        mainLst = []
        moveLst = []
        if old_position == '':
            mainLst = articles
            n_id = self.db.save('article', {'name': 'Neue Gruppe',
                'project_id': project_id, 'position': new_position,
                'type': article_type, "user_id": user["id"]})
            moveLst = [{'id': n_id, 'position': new_position}]
        else:
            for art in articles:
                if art['position'].startswith(old_position):
                    c_rest = art['position'][len(old_position):]
                    moveLst.append({'id': art['id'],
                        'position': f'{new_position}{c_rest}', 'changed': True})
                else:
                    mainLst.append(art)
        # 2. find spot in lst.
        spot = -1
        for nr, art in enumerate(mainLst):
            if art['position'] == new_position:
                spot = nr
        # 3. if there is a spot in the main lst, replace it; if not: add and order it.
        if spot > -1:
            # there is a spot in the main lst
            moveLst.reverse()
            for art in moveLst:
                mainLst.insert(spot, art)
        else:
            # there is no spot in the main lst!
            mainLst += moveLst
            mainLst = sorted(mainLst, key=itemgetter('position'))
        # 4. recalcuate the position
        o_articles = []
        c_path = ''
        c_name = -1
        c_depth = 0
        for art in mainLst:
            if c_depth < art['position'].count('.'):
                c_depth = art['position'].count('.')
                c_path = f'{c_path}{c_name}.'
                c_name = '000'
            elif c_depth > art['position'].count('.'):
                c_name = c_path[-4*(c_depth-art['position'].count('.')):][:3]
                c_path = c_path[:-4*(c_depth-art['position'].count('.'))]
                c_depth = art['position'].count('.')
            c_name = f'{int(c_name)+1}'.zfill(3)
            if art['position'] != f'{c_path}{c_name}' or art.get('changed', False):
                self.db.save('article', {'position': f'{c_path}{c_name}'}, art['id'])

    def zettel_delete(self, zettel):
        # removes imgs from directory
        if zettel.get("img_folder", None) != None and zettel.get("sibling", None) == None:
            remove(f"{self.p}/zettel/{zettel['letter']}/{zettel['img_folder']}/{zettel['id']}.jpg")
            if self.doublesided == True:
                remove(f"{self.p}/zettel/{zettel['letter']}/{zettel['img_folder']}/{zettel['id']}v.jpg")

    def zettel_import(self, test, user):
        # uploading images for zettel-db
        u_letter = request.forms.letter
        if len(u_letter) == 1 and u_letter.isalpha() and "z_add" in user["access"]:
            u_type = request.forms.type
            u_path = self.p + "/content/import_zettel/"
            # if the imgs are uploaded via website, save them to upload folder
            if request.forms.from_folder == "":
                u_files = request.files.getall("files")
                if len(u_files) == 0:
                    return False
                else:
                    if path.exists(u_path) == False: mkdir(u_path)
                    for u_file in u_files:
                        u_file.save(u_path)
            f_lst = []
            for lst in listdir(u_path):
                if lst[-4:] == ".jpg":
                    f_lst.append(lst)
            f_lst.sort()

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
            for f in f_lst:
                c_loop += 1
                if recto:
                    # create entry in db
                    save_dict = {"c_date": date.today(), "user_id": c_user_id,
                            "letter": u_letter, "created_by": c_user_id,
                            "in_use": True, "created_date": date.today()}
                    if u_type != "0":
                        save_dict["type"] = u_type
                    new_id = self.db.save("zettel", save_dict)
                    self.db.save("zettel", {"img_folder": f"{(new_id-1)//max_files}"},
                            new_id)
                    # create subfolder so that no folder has more than 1'000 files
                    c_path = f_path + f"{(new_id-1)//max_files}/"
                    if path.exists(c_path) == False: mkdir(c_path)
                    # rename and move file
                    rename(u_path + f, c_path + f"{new_id}.jpg")
                    if self.doublesided:
                        recto = False
                else:
                    rename(u_path + f, c_path + f"{new_id}v.jpg")
                    recto = True
            return True
        else:
            return False

    # ################################################################
    # -III- REST requests
    # ################################################################
    def data_batch(self):
        user = self.auth()
        res = request.json["res"]
        items = request.json["items"]
        mode = request.json["mode"]
        if res == None or items == None: HTTPResponse(status=404)
        if mode == "create":
            for item in items:
                self.data_create(res, item["data"])
        elif mode == "update":
            for item in items:
                self.data_update(res, item["res_id"], item["data"])
        elif mode == "delete":
            # items is array with object: [{"res_id": x}, {"res_id": y}, ...]
            for item in items:
                self.data_delete(res, item["res_id"])
        else:
            HTTPResponse(status=404)

    def data_create(self, res, inData=None):
        user = self.auth()
        if inData ==None: inData = request.json
        if res == "":
            return HTTPResponse(status=400)
        elif res in self.dockerData.keys():
            dock = self.dockerData[res]
            if dock['access'] in user['access']:
                if inData == None:
                    # file-import
                    if res == "zettel":
                        if self.zettel_import(request, user):
                            return HTTPResponse(status=201) # created 
                        else:
                            return HTTPResponse(status=400)
                else:
                    if dock.get("restricted", None) == "user_id":
                        inData["user_id"] = user["id"]
                    elif dock.get("restricted", None) == "password":
                        if self.pw_check(self.db.search("user", {"id": user["id"]}, ["password"])[0]["password"], inData["c_password"]) == False:
                            return HTTPResponse(status=403)
                        else:
                            del inData["c_password"]
                    self.db.save(dock['table'], inData)
                    return HTTPResponse(status=201) # created 
            else:
                return HTTPResponse(status=403)
        else:
            return HTTPResponse(status=404)

    def data_get(self, res, res_id=None):
        user = self.auth()
        if res == "":
            return HTTPResponse(status=400)
        elif res in self.dockerData.keys():
            dock = self.dockerData[res]
            if dock['access'] in user['access']:
                query = json.loads(request.query.get("qJSON", "{}"))
                if dock.get("restricted", None) == "user_id":
                    if query == "{}":
                        query = {"user_id", user["id"]}
                    else:
                        query["user_id"] = user["id"]
                elif dock.get("restricted", None) == "password":
                        if self.pw_check(self.db.search("user", {"id": user["id"]}, ["password"])[0]["password"], query["c_password"]) == False:
                            return HTTPResponse(status=403)
                        else:
                            del query["c_password"] # ONLY WORKS WITH JSON QUERY!!
                if dock.get("table") != None:
                    o_cols = dock.get("o_cols", [])
                    if dock.get("allowUserOrder", None) != None and user.get("order_by_id", 0) != 0:
                        o_cols = ["id"]
                    limit = dock.get("limit", 10001)
                    return json.dumps(self.db.search(dock["table"], query, dock["r_cols"], o_cols, limit), default=str)
                elif dock.get("function") != None:
                    # external function needs to return data directly
                    dock["res"] = res
                    dock["res_id"] = res_id
                    request.dock = dock
                    self.dataFunctions[dock["function"]]()
                else:
                    return HTTPResponse(status=404)
            else:
                return HTTPResponse(status=403)
        else:
            return HTTPResponse(status=404)

    def data_update(self, res, res_id=None, inData=None):
        user = self.auth()
        if inData == None: inData = request.json
        if res == "":
            return HTTPResponse(status=400)
        elif res in self.dockerData.keys():
            dock = self.dockerData[res]
            if dock['access'] in user['access']:
                if dock.get("restricted", None) == "user_id":
                    if(len(self.db.search(dock['table'], {"id": res_id, "user_id": user["id"]})) == 0):
                        return HTTPResponse(status=403)
                elif dock.get("restricted", None) == "password":
                    if self.pw_check(self.db.search("user", {"id": user["id"]}, ["password"])[0]["password"], inData["c_password"]) == False:
                        return HTTPResponse(status=403)
                    else:
                        del inData["c_password"]
                if dock.get("table") != None:
                    self.db.save(dock['table'], inData, res_id)
                if dock.get("command") != None:
                    self.db.command(f"CALL {dock['command']}();", [], True)
                if dock.get("function") != None:
                    self.dataFunctions[dock["function"]](user)
                return HTTPResponse(status=200) # OK
            else:
                return HTTPResponse(status=403)
        else:
            return HTTPResponse(status=404)

    def data_delete(self, res, res_id):
        # DELETE METHOD, no body
        user = self.auth()
        if res == "" or res_id == None:
            return HTTPResponse(status=400)
        elif res in self.dockerDataDelete.keys():
            dock = self.dockerDataDelete[res]
            if dock['access'] in user['access']:
                query = {"id": res_id}
                if dock.get("restricted", None) == "user_id": query[dock["restricted"]] = user["id"]
                # remove files from directory?
                if "zettel" == dock['table']:
                    self.zettel_delete(self.db.search("zettel", {"id": res_id})[0])
                self.db.delete(dock['table'], query)
                return HTTPResponse(status=204) # OK NO BODY
            else:
                return HTTPResponse(status=403)
        else:
            return HTTPResponse(status=404)

    def page(self, res, res_id = None):
        user = self.auth()
        if request.query.get("query") != None:
            query = request.query.get("query")
            if res_id != None: query += " ID:" + res_id
        elif request.query.get("qJSON") != None:
            query = json.loads(request.query.get("qJSON"))
            if res_id != None: query["id"] = res_id
        else:
            query = ""
            if res_id != None: query = {"id": res_id}
        offset = request.query.get("offset") if request.query.get("offset") != None else 0

        if res == "":
            return HTTPResponse(status=400)
        elif res in self.dockerPage.keys():
            dock = self.dockerPage[res]
            if dock['access'] in user['access']:
                if dock.get("items") != None:
                    o_cols = dock["items"].get("o_cols", [])
                    if dock.get("allowUserOrder", None) != None and user.get("order_by_id", 0) != 0:
                        o_cols = ["id"]
                    items = self.db.search(dock["items"]["table"], query,
                            dock["items"]["r_cols"], o_cols,
                            dock["items"]["limit"], offset)
                    cHelper = dock["items"]["table"]
                else:
                    items = [{}]
                    cHelper = None
                if len(items) == 0 and dock.get("notNull", False):
                    return HTTPResponse(status=204)
                elif dock.get("function") != None:
                    # external function needs to return data directly
                    dock["res"] = res
                    dock["res_id"] = res_id
                    return self.dataFunctions[dock["function"]](dock)
                else:
                    return template(dock["template"], items=items, user=user, res=res,
                            query=query, help_lst=self.db.search_helper.get(cHelper),
                            c_date=str(datetime.now())[:19], doublesided=self.doublesided,
                            captions=self.captions, main_version=self.main_version,
                            sub_version=self.sub_version)
            else:
                return HTTPResponse(status=403)
        else:
            return HTTPResponse(status=404)

    # ################################################################
    # -IV- file requests
    # ################################################################
    def f_css(self, css_file):
        return static_file(css_file, root=self.p_html + "/css/")

    def f_js(self, js_file):
        self.auth()
        return static_file(js_file, root=self.p_html + "/js/")

    def f_mlw(self, mlw_file):
        user = self.auth()
        if "editor" in user["access"]:
            # CHECK HERE, IF USER IS ALLOWED TO DOWNLOAD PROJECT
            return static_file(mlw_file, root=self.p + "/export_project/")

    def f_video(self, video_file):
        user = self.auth()
        return static_file(video_file, root=self.p + "/content/videos/")

    def f_zettel(self, letter, dir_nr, img):
        self.auth()
        return static_file(img, root=self.p + f"/zettel/{letter}/{dir_nr}")

    def library_edition(self, page_id):
        user = self.auth()
        if "library" in user["access"]:
            page = self.db.search("scan", {"id": page_id}, ["path", "filename"])[0]
            return static_file(page["filename"]+".png", root=self.p + "/content/scans/" + page["path"])

    # ################################################################
    # -IV- file requests
    # ################################################################
    def project_export(self, dock):
        user = self.auth()
        id=dock["res_id"]
        if "editor" in user["access"]:
            c_project = self.db.search("project", {"id": id}, ["user_id", "name"])[0]
            if c_project["user_id"] == user["id"]:
                articles = self.db.search("article", {"project_id": id},
                        ["position", "name", "id", "type"], ["position"])
                article_txt = ""
                article_lst = []
                c_article = ""
                c_lvl = 0
                for article in articles:
                    if article["position"] != "000":
                        # new article
                        if article["position"].find(".") == -1 and article_txt != "":
                            article_txt += f'AUTOR {user["last_name"]}'
                            article_lst.append(article_txt)
                            article_txt = ""

                        # new group inside of an article
                        if article["position"] != c_article:
                            c_article = article["position"]
                            c_lvl = c_article.count(".")
                            if article_txt != "":
                                if article['type'] == 0:
                                    if c_lvl == 1:
                                        article_txt += "BEDEUTUNG"
                                    elif c_lvl == 2:
                                        article_txt += "\tUNTER_BEDEUTUNG"
                                    elif c_lvl == 3:
                                        article_txt += "\t\tUNTER_UNTER_BEDEUTUNG"
                                    elif c_lvl >= 4:
                                        article_txt += ("\t"*c_lvl) + ("U"*c_lvl) + "_BEDEUTUNG"
                                elif article["type"] == 1:
                                        article_txt += ("\t"*(c_lvl-1)) + "LEMMA"
                                elif article["type"] == 2:
                                        article_txt += ("\t"*(c_lvl-1)) + "ANHÄNGER"
                                elif article["type"] == 3:
                                        article_txt += ("\t"*(c_lvl-1)) + "???"
                                elif article["type"] == 4:
                                        article_txt += ("\t"*(c_lvl-1)) + "???"
                                elif article["type"] == 5:
                                        article_txt += ("\t"*(c_lvl-1)) + "//"
                            else:
                                article_txt = "LEMMA"
                            article_txt += " " + article["name"] + "\n"

                        zettels = self.db.search("zettel_lnk_view",
                                {"article_id": article["id"]}, ["example_plain",
                                    "display_text", "include_export", "comments",
                                    "stellenangabe"],
                                ["date_sort"])
                        # collect zettels
                        for zettel in zettels:
                            if zettel.get("include_export", 0) == 1:
                                article_txt += ("\t"*(c_lvl+1)) + "* "
                                article_txt += f"{zettel.get('example_plain', '')}; {zettel.get('stellenangabe', '')} "
                                article_txt += f"\"{zettel.get('display_text', '')}\"\n"
                                if zettel.get("comments", None):
                                    cmnts = json.loads(zettel["comments"])
                                    for cmnt in cmnts:
                                        article_txt += ("\t"*(c_lvl+1)) + f"/* {cmnt.get('user', '')}, am {cmnt.get('date', '')[:10]}: {cmnt.get('comment', '')} */\n"
                article_txt += f'AUTOR {user["last_name"]}'
                article_lst.append(article_txt)

                c_path = self.p + "/export_project/"
                if path.exists(c_path) == False: mkdir(c_path)
                export_path = c_path+c_project["name"].replace(" ", "_")+".zip"
                export_url = "/export_project/"+c_project["name"].replace(" ", "_")+".zip"
                if path.exists(export_path): remove(export_path)
                ex_zip = zipfile.ZipFile(export_path, "w")
                export_txt = ''
                for article in article_lst:
                    c_name = article.split("\n")[0][6:]
                    c_file = open(c_path+c_name+".mlw", "w")
                    c_file.write(article)
                    export_txt += '<p>' + article.replace('\n', '<br />').replace('\t', '&nbsp;&nbsp;&nbsp;&nbsp;') + '</p>'
                    c_file.close()
                    ex_zip.write(c_path+c_name+".mlw", c_project["name"]+"/"+c_name+".mlw")
                    #kompiliere_mlw(c_path+c_name+".mlw")
                    remove(c_path+c_name+".mlw")
                ex_zip.close()

                return template("project/project_export", article_lst=article_lst,
                        export_url=export_url, preview=export_txt)
################################################################################
    # OLD!
    def account_create(self):
        # process POST - if successful redirect to /
        r_lst = []
        if request.forms.create_user:
            user = {"first_name": request.forms.first_name,
                    "last_name": request.forms.last_name,
                    "email": request.forms.email,
                    "password": request.forms.password,
                    "access": []}
            if (user["first_name"] and user["last_name"] and user["email"] and
                    user["password"]):
                c_email = self.db.search("user", {"email": user["email"]}, ["id"])
                if len(c_email) == 0:
                    user["password"] = self.pw_set(user["password"])
                    self.db.save("user", user)
                    redirect("/")
                else:
                    r_lst.append("E-Mail Adresse bereits vorhanden.")
            else:
                r_lst.append("Bitte füllen Sie alle Felder aus.")
        if len(self.sub_version) == 0:
            c_date = self.main_version[0]['date']
        else:
            c_date = self.sub_version[0]['date']
        return template("account/account_create", r_lst=r_lst, captions=self.captions["index"], colors=self.color_scheme, c_date=c_date)

    def module(self):
        user = self.login_check(request.forms.user, request.forms.pw)
        if user == None:
            return "wrong username or password."
        elif "module" not in user["access"]:
            return "access not granted."
        else:
            if request.forms.mode == 'version':
                r_date = ''
                if request.forms.table in ['author', 'work', 'lemma']:
                    r_date = self.db.search('stat', {'id': 1}, [request.forms.table])[0]
                elif request.forms.table in ['lemma_view']:
                    r_date = self.db.search('stat', {'id': 1}, ['lemma'])[0]
                elif request.forms.table in ['opera_view']:
                    opera_view = self.db.search('stat', {'id': 1}, ['author', 'work'])[0]
                    if opera_view['author'] < opera_view['work']:
                        r_date = opera_view['work']
                    else:
                        r_date = opera_view['author']
                if r_date != '':
                    return f'{r_date}'

            elif request.forms.mode == 'search':
                try:
                    query = json.loads(request.forms.query)
                except:
                    query = request.forms.query
                table = request.forms.table
                cols = json.loads(request.forms.cols)
                o_cols = json.loads(request.forms.o_cols)

                if request.forms.html == "True":
                    allow_html = True
                else:
                    allow_html = False
                dump = self.db.search(table, query, cols, o_cols)

                #dump = s_html(json.dumps(raw_dump))
                #if allow_html == False:
                #    rep_dict = {"&lt;": "<", "&gt;": ">", "&quote;": "'", "&#x27;": "'",
                #            "<.*?>": ""}
                #    for key, value in rep_dict.items():
                #        dump = re.sub(key, value, dump)
                return json.dumps(dump)

    def index(self):
        # process login request
        if request.method == "POST":
            login = request.forms.login
            email = request.forms.email
            password = request.forms.password
            if login != "" and email != "" and password != "":
                user_login = self.login_check(email, password)
                if user_login != None:
                    new_key = str(uuid4())
                    data = {"session": new_key,
                            "session_last_active": str(datetime.now()),
                            "agent":request.headers.get('User-Agent')
                            }
                    self.db.save("user", data, user_login.get("id"))
                    response.set_cookie("mlw_session", new_key, secure = self.cookie_secure)
            if request.query.href != "":
                redirect(request.query.href)
            else:
                redirect("/?animate=true")
        # after login
        user = self.auth(start = True)
        if len(self.sub_version) == 0:
            c_date = self.main_version[0]['date']
        else:
            c_date = self.sub_version[0]['date']
        return template('index', user=user, c_date=c_date,
                captions=self.captions["index"], main_menu = self.main_menu,
                colors=self.color_scheme)

    def library_viewer(self):
        user = self.auth()
        if "library" in user["access"]:
            scan = {}
            scan["c_page"] = request.query.page
            edition = self.db.search("edition_view", {"id": int(request.query.edition)},
                    ["id", "opus", "path"])[0]
            pages = self.db.search("scan_lnk_view",
                    {"edition_id": int(request.query.edition)}, ["id", "filename"])

            for nr, page in enumerate(pages):
                if page["filename"] == scan["c_page"]:
                    scan["c_page_id"] = page["id"]
                    c_page_id = page["id"]
                    if nr > 0:
                        scan["l_page"] = pages[nr-1]["filename"]
                    if nr < (len(pages)-1):
                        scan["n_page"] = pages[nr+1]["filename"]
                    break
            else:
                scan["l_page"] = pages[-2]["filename"]
                scan["c_page"] = pages[-1]["filename"]
                scan["c_page_id"] = pages[-1]["id"]

            return template("library/viewer", edition=edition, pages=pages, scan=scan, colors=self.color_scheme)

    def logout(self):
        self.auth(logout = True)
