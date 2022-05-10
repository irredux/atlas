#!/user/bin/env python3
# -*- coding: utf-8 -*-
"""server.py - uses flask to send and receive data from dMLW Database

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

Version: 1.1 - 13.4.2022
"""
from binascii import hexlify
from cheroot.wsgi import Server as WSGIServer, PathInfoDispatcher as WSGIPathInfoDispatcher
from cheroot.ssl.builtin import BuiltinSSLAdapter
from configparser import ConfigParser
from datetime import datetime, timedelta
from flask import abort, Flask, request, send_file, Response, session, redirect
from hashlib import pbkdf2_hmac
import json
from os import listdir, mkdir, path, urandom
from PIL import Image
from shutil import make_archive, rmtree
from sys import argv
import subprocess
import threading
from uuid import uuid4
from pathlib import Path
from arachne import Arachne
from archimedes import Archimedes
from export import Exporter
import logging

dir_path = path.dirname(path.abspath(__file__))
faszikel_dir = path.dirname("/local/ovc/MLW/export/processing/")

#load cfg
if len(argv) > 1: cfg_path = argv[1]
else: cfg_path = dir_path+"/config/localhost.ini"
cfg = ConfigParser()
cfg.read(cfg_path)

# set global vars and methods
full_update = "2021-05-31 09:54:00" # local client-sided database

# set db
search_cols = f"{dir_path}{cfg['default_path']['search_columns']}"
access_config = f"{dir_path}{cfg['default_path']['access_config']}"
db = Arachne(cfg['database'])
auto = Archimedes(db, dir_path)
exporter = Exporter(db, dir_path)

# set server
app = Flask(__name__)
secret_key = urandom(24)
secret_key = hexlify(secret_key)
app.config["SECRET_KEY"] = secret_key
try:
    from flask_cors import CORS # only for testing react apps locally!
except ImportError: print("CORS module not found! No CORS functions available.")
else: CORS(app)
server_cfg = cfg["connection"]
server = WSGIServer((server_cfg.get('host'), int(server_cfg.get('port'))), WSGIPathInfoDispatcher({"/": app}))

if server_cfg.get("https") == "True":
    server.ssl_adapter = BuiltinSSLAdapter(
            server_cfg.get('certfile'),
            server_cfg.get('keyfile'),
            server_cfg.get('chainfile')
        )

class Server_Settings:
    def __init__(self):
        # set session parameter
        self.s_hours = 4
        self.s_minutes = 0

        # load JSON files from /config
        with open(dir_path + "/config/mainMenu.JSON") as menu_file: # old version
            self.main_menu = json.load(menu_file)
        with open(dir_path + "/config/objectStores.JSON") as config_file: # old version
            self.oStores = json.load(config_file)
        with open(dir_path + "/config/accessCREATE.JSON") as access_file:
            self.accessCREATE = json.load(access_file)
        with open(dir_path + "/config/accessREAD.JSON") as access_file:
            self.accessREAD = json.load(access_file)
        with open(dir_path + "/config/accessUPDATE.JSON") as access_file:
            self.accessUPDATE = json.load(access_file)
        with open(dir_path + "/config/accessDELETE.JSON") as access_file:
            self.accessDELETE = json.load(access_file)

        # doublesided zettel
        if server_cfg.get("doublesided") == "True": self.doublesided = True
        else: self.doublesided = False
srv_set = Server_Settings()

logging.basicConfig(filename=dir_path + "/dmlw.log", level=logging.DEBUG, format="%(asctime)s %(levelname)s %(name)s %(message)s")

# ################################################################
# -I- assorted functions
# ################################################################
def auth(c_session):
    access = ["auth"]
    logout = False

    if session.get("session", None) == None:
        if c_session == "" or c_session == None: abort(401) # unauthorized
        c_session = c_session[7:]
    else:
        c_session = session.get("session", None)

    usr_i = db.search("user", {"session": c_session}, ["id", "first_name",
        "last_name", "email", "session_last_active", "access", "settings", "password"])

    if len(usr_i) == 1:
        u_last = usr_i[0].get("session_last_active")
        u_access = set(json.loads(usr_i[0].get("access")))
        session_max = timedelta(hours=srv_set.s_hours, minutes=srv_set.s_minutes)
        update_after = timedelta(hours=0, minutes=10)
        if (session_max >= (datetime.now() - u_last) and logout == False and
                set(access).issubset(u_access)):
            # session ok
            if update_after <= (datetime.now() - u_last):
                db.save("user", {"session_last_active": datetime.now()},
                        usr_i[0].get("id"))
            usr_i[0]["access"] = json.loads(usr_i[0]["access"])
            return usr_i[0]
        else:
            # session is too old or logout
            db.save("user", {"session": ""}, usr_i[0].get("id"))
            abort(401) # unauthorized
    else:
        abort(401) # unauthorized

def create_mlw_file(i_datas):
    o_datas = []
    for i_data in i_datas:
        with open(dir_path + "/MLW-Software/input.mlw", "w") as i_file:
            i_file.write(i_data)
        if path.exists(dir_path + "/MLW-Software/Ausgabe"): rmtree(dir_path + "/MLW-Software/Ausgabe")
        subprocess.run(
                f"python3 {dir_path}/MLW-Software/MLWServer.py --port 9997 {dir_path}/MLW-Software/input.mlw",
                shell=True)
        o_data = {}
        with open(dir_path + "/MLW-Software/Ausgabe/HTML-Vorschau/input.html", "r") as html_file:
            o_data["html"] = html_file.read()
        o_datas.append(o_data)
    subprocess.run(f"python3 {dir_path}/MLW-Software/MLWServer.py --port 9997 --stopserver", shell=True)
    return json.dumps(o_datas)

def login_check(user, pw):
    user_login = db.search("user", {"email": user}, ["id", "password",
        "session", "access", "session_last_active"])
    if (len(user_login) == 1 and "auth" in user_login[0]["access"] and
            pw_check(user_login[0]["password"], pw)):
        return user_login[0]
    else:
        return None

def pw_check(pw_db, pw_input):
    salt = pw_db[:64]
    pw_input = pbkdf2_hmac("sha512",
            pw_input.encode("utf-8"),
            salt.encode("ascii"), 100000)
    if pw_db[64:] == hexlify(pw_input).decode("ascii"):
        return True
    else:
        return False

def pw_set(pw_raw):
    salt = hexlify(urandom(32))
    key = pbkdf2_hmac("sha512", pw_raw.encode("utf-8"), salt, 100000)
    key = hexlify(key)
    return (salt+key).decode("ascii")

# ################################################################
# -II- routes
# ################################################################
@app.route("/react/index.html") # legacy reroute; can be removed in next version
@app.route("/")
def login(): return send_file(dir_path+"/static/db/index.html")
@app.route("/site/viewer/<resId>") # legacy reroute; can be removed in next version
def viewer(resId): return redirect(f"/static/viewer/index.html?edition={resId}")

# session
@app.route("/session", methods=["POST"])
def session_create():
    email = request.json.get("user", "")
    password = request.json.get("password", "")
    if email != "" and password != "":
        user_login = login_check(email, password)
        if user_login != None:
            new_key = str(uuid4())
            data = {"session": new_key,
                    "session_last_active": str(datetime.now()),
                    "agent":request.headers.get('User-Agent')
                    }
            db.save("user", data, user_login["id"])
            session["session"] = data["session"]
            return data["session"]
        else: abort(401) # unauthorized
    else: abort(401) # unauthorized

@app.route("/session", methods=["GET"])
def session_read():
    user = auth(request.headers.get("Authorization"))
    r_user = {"id": user["id"], "first_name": user["first_name"],
            "last_name": user["last_name"], "email": user["email"], "access": user["access"]}
    return json.dumps(r_user)

@app.route("/session", methods=["DELETE"])
def session_delete():
    user = auth(request.headers.get("Authorization"))
    db.save("user", {"session": ""}, user["id"])
    return Response("", status=200)

# config
@app.route("/config/<res>", methods=["GET"])
def config_read(res):
    user = auth(request.headers.get("Authorization"))
    if res=="oStores":
        r_stores = []
        for store in srv_set.oStores:
            for permission in srv_set.accessREAD[store["name"]]:
                if permission["access"] in user["access"]:
                    r_stores.append(store)
                    break
        return json.dumps(r_stores)
    elif res == "access": return json.dumps(user["access"])
    elif res == "menu":
        user_menu = []
        for key, menu in srv_set.main_menu.items():
            if menu["access"] == "*" or menu["access"] in user["access"]:
                nItems = []
                for subMenu in menu["items"]:
                    if subMenu.get("access", "*") == "*" or subMenu.get("access") in user["access"]:
                        nItems.append(subMenu)
                if len(nItems) != 0: user_menu.append([key, nItems])
        return json.dumps(user_menu)
    else: abort(404) # not found

# info 
@app.route("/info/<res>", methods=["GET"])
def info_read(res):
    user = auth(request.headers.get("Authorization"))
    if res not in srv_set.accessREAD.keys(): abort(404) # not found
    user_id = ""
    v_vals = []
    for permission in srv_set.accessREAD[res]:
        if permission["access"] in user["access"]:
            if permission.get("restricted", "") == "user_id":
                if res != "user": user_id = f" user_id = %s AND"
                else: user_id = f" id = %s AND"
                v_vals.append(user["id"]);
            break
    else: abort(403) # forbidden

    max_date = db.command(f"SELECT MAX(u_date) as r FROM {res} WHERE{user_id} deleted IS NULL", v_vals)[0]["r"]
    length = db.command(f"SELECT COUNT(id) as r FROM {res} WHERE{user_id} deleted IS NULL", v_vals)[0]["r"]
    describe = db.command(f"DESCRIBE {res}")
    return json.dumps({"max_date": max_date, "length": length, "describe": describe}, default=str)

# data
@app.route("/data_batch/<res>", methods=["GET", "POST", "DELETE"]) # PATCH?
def data_batch(res):
    # block if res == user?
    data = request.json
    if request.method == "POST":
        for d in data:
            if "id" in d:
                # update
                id = d["id"]
                del d["id"]
                re = data_update(res, id, d)
                if(re.status_code != 200): abort(400) # error
            else:
                # create
                re = data_create(res, d)
                if(re.status_code != 201): abort(400) # error
        return Response("", status=200) # ok
    elif request.method == "DELETE":
        for d in data:
            re = data_delete(res, d)
            if(re.status_code != 200): abort(400) # error
        return Response("", status=200) # ok
    else: abort(400) # bad request

@app.route("/data/user", methods=["POST"])
def user_create():
    user = {"first_name": request.json["first_name"],
            "last_name": request.json["last_name"],
            "email": request.json["email"],
            "password": request.json["password"],
            "access": []}
    if (user["first_name"] != "" and user["last_name"] != "" and
            user["email"] != "" and user["password"] != ""):
        c_email = db.search("user", {"email": user["email"]}, ["id"])
        if len(c_email) == 0:
            user["password"] = pw_set(user["password"])
            db.save("user", user)
            return Response("", status=201) # CREATED
        else: abort(409) # CONFLICT
    else: abort(406) # NOT ACCEPTABLE

@app.route("/data/user/<int:id>", methods=["PATCH"])
def user_update(id):
    user = auth(request.headers.get("Authorization"))
    n_access = request.json.get("access", None)
    o_password = request.json.get("old_password", None)
    n_password = request.json.get("new_password", None)
    n_first_name = request.json.get("first_name", None)
    n_last_name = request.json.get("last_name", None)
    n_email = request.json.get("email", None)

    if n_access != None and "admin" in user["access"]:
        db.save("user", {"access": n_access}, id)
        return Response("", status=200) # OK
    elif n_email != None and id == user["id"]:
        db.save("user", {"email": n_email, "first_name": n_first_name,
            "last_name": n_last_name}, id)
        return Response("", status=200) # OK
    elif (n_password != None and o_password != None and
            id == user["id"] and pw_check(user["password"], o_password)):
        db.save("user", {"password": pw_set(n_password)}, id)
        return Response("", status=200) # OK
    else: abort(404)

@app.route("/data/user/<int:id>", methods=["DELETE"])
def user_delete(id):
    user = auth(request.headers.get("Authorization"))
    if "admin" in user["access"]:
        db.delete("user", {"id": id})
        return Response("", status=200) # OK
    else: abort(404)

@app.route("/data/<res>", methods=["POST"])
def data_create(res, inData=None):
    user = auth(request.headers.get("Authorization"))
    if res not in srv_set.accessCREATE.keys(): abort(404) # not found
    for permission in srv_set.accessCREATE[res]:
        if permission["access"] in user["access"]:
            if inData == None: inData = request.json
            if permission.get("restricted", "") == "user_id":
                inData["user_id"] = user["id"]
            #elif permission.get("restricted", "") == "shared_id": #  cannot use shared_id when creating new entries!
                #inData["shared_id"] = user["id"]
            break
    else:
        abort(403) # forbidden
    r_id = db.save(res, inData)
    return Response(str(r_id), status=201, mimetype="text/plain") # created

@app.route("/data/<res>", methods=["GET"])
@app.route("/data/<res>/<int:res_id>", methods=["GET"])
def data_read(res, res_id=None, in_query=None, return_lst=False):
    user = auth(request.headers.get("Authorization"))
    if res not in srv_set.accessREAD.keys(): abort(404) # not found
    r_cols = ""
    v_cols = []
    user_id = ""
    for permission in srv_set.accessREAD[res]:
        if permission["access"] in user["access"]:
            if permission.get("restricted", "") == "user_id":
                if res != "user": user_id = f" user_id = %s AND"
                else: user_id = f" id = %s AND"
                v_cols.append(user['id'])
            elif permission.get("restricted", "") == "shared_id":
                if res != "user": user_id = f" (user_id = %s OR shared_id = %s) AND"
                else: abort(403) # forbidden
                v_cols.append(user['id'])
                v_cols.append(user['id'])
            r_cols = permission["r_cols"]
            break
    else:
        abort(403) # forbidden

    if in_query: jQuery = in_query
    else: jQuery = request.args.get("query", None) # query in json format: [{c: col, o: operator, v: value}, ...]

    if jQuery != None:
        # search with query
        qLimit = request.args.get("limit", None)
        qOffset = request.args.get("offset", None)
        qCount = request.args.get("count", None)
        qSelect = request.args.get("select", None)
        qOrder = request.args.get("order", None)
        qGroup = request.args.get("group", None)

        json_query = json.loads(jQuery)
        q_lst = []
        q_txt = ""
        for q in json_query:
            if q["v"] == "NULL" and q["o"] == "=":
                q_lst.append(f"{q['c']} IS NULL")
            elif q["v"] == "NULL" and q["o"] == "!=":
                q_lst.append(f"{q['c']} IS NOT NULL")
            else:
                if type(q["v"]) is str and q["v"].find("*")>-1:
                    q["o"] = "LIKE"
                    q["v"] = q["v"].replace("*", "%")
                elif type(q["v"]) is list:
                    q["o"] = "IN"
                q_lst.append(f"{q['c']} {q['o']} %s")
                v_cols.append(q["v"])
        q_txt = " AND ".join(q_lst)
        q_txt = f" {q_txt} "
        w_txt = ""
        if user_id != "" or q_txt != "":
            w_txt = f"WHERE{user_id}{q_txt}"
        if qCount != None: r_cols = "COUNT(*) AS count"
        if qSelect!=None:
            qSelect = json.loads(qSelect)
            if r_cols == "*" or qSelect.issubset(r_cols): r_cols = ", ".join(qSelect)
            else: abort(403) # forbidden
        limit_txt = ""
        if qLimit!=None: limit_txt = f" LIMIT {qLimit}"
        offset_txt = ""
        if qOffset!=None: offset_txt = f" OFFSET {qOffset}"
        order_txt = ""
        if qGroup!=None:
            order_txt = f" GROUP BY {qGroup}"
        if qOrder!=None:
            qOrder = json.loads(qOrder)
            order_txt = f" ORDER BY {', '.join(qOrder)}"
        sql = f"SELECT {r_cols} FROM {res} {w_txt}{order_txt}{limit_txt}{offset_txt}"
        #print(sql, v_cols)
        results = db.command(sql, v_cols)
        if return_lst:
            return results
        else:
            return Response(json.dumps(results, default=str), mimetype="application/json")
    elif res_id == None:
        # sync with local db
        u_date = request.args.get("u_date", "2020-01-01 01:00:00")
        v_cols.append(u_date)
        results = db.command(f"SELECT {r_cols} FROM {res} WHERE{user_id} u_date > %s ORDER BY u_date ASC LIMIT 10000", v_cols)
        if return_lst:
            return results
        else:
            return Response(json.dumps(results, default=str), mimetype="application/json")
    else:
        # search with dataset id
        v_cols.append(res_id)
        results = db.command(f"SELECT {r_cols} FROM {res} WHERE{user_id} id = %s", v_cols)
        if return_lst:
            return results
        else:
            return Response(json.dumps(results, default=str), mimetype="application/json")


@app.route("/export/<res>", methods=["GET"])
@app.route("/export/<res>/<int:res_id>", methods=["GET"])
def data_export(res, res_id=None, in_query=None):
    export_lst = data_read(res, res_id, in_query, return_lst=True)
    pdfFileName = exporter.create_pdf_from_zettel(export_lst)
    return Response(pdfFileName)

@app.route("/data/<res>/<int:res_id>", methods=["PATCH"])
def data_update(res, res_id, inData=None):
    user = auth(request.headers.get("Authorization"))
    if res not in srv_set.accessUPDATE.keys(): abort(404) # not found
    for permission in srv_set.accessUPDATE[res]:
        if permission["access"] in user["access"]:
            if inData == None: inData = request.json
            if permission.get("restricted", "") == "user_id":
                if user["id"] == db.search(res, {"id": res_id}, ["user_id"])[0]["user_id"]:
                    break
            elif permission.get("restricted", "") == "shared_id":
                if (
                    user["id"] == db.search(res, {"id": res_id}, ["user_id"])[0]["user_id"] or
                    user["id"] == db.search(res, {"id": res_id}, ["shared_id"])[0]["shared_id"]
                ):
                    break
            else:
                break
    else:
        abort(403) # forbidden
    r_id = db.save(res, inData, res_id)
    return Response("", status=200) # ok

@app.route("/data/<res>/<int:res_id>", methods=["DELETE"])
def data_delete(res, res_id):
    user = auth(request.headers.get("Authorization"))
    if res not in srv_set.accessDELETE.keys(): abort(404) # not found
    for permission in srv_set.accessDELETE[res]:
        if permission["access"] in user["access"]:
            if permission.get("restricted", "") == "user_id":
                if user["id"] == db.search(res, {"id": res_id}, ["user_id"])[0]["user_id"]:
                    break
            elif permission.get("restricted", "") == "shared_id":
                if (
                    user["id"] == db.search(res, {"id": res_id}, ["user_id"])[0]["user_id"] or 
                    user["id"] == db.search(res, {"id": res_id}, ["shared_id"])[0]["shared_id"]
                ):
                    break
            else:
                break
    else:
        abort(403) # forbidden
    #r_id = db.save(res, {"deleted": 1}, res_id)
    db.delete(res, {"id": res_id})
    return Response("", status=200) # ok

# static files
@app.route("/file/faszikel/<dir_name>/<file_name>/")
def faszikel_export(dir_name, file_name):
    user = auth(request.headers.get("Authorization"))
    if "faszikel" in user["access"]:
        if file_name == "log":
            return send_file(faszikel_dir+f"/{dir_name}/tex/mlw.context.log")
        elif file_name == "zip":
            new_file = path.join(dir_path,"temp/articles.zip")
            new_path = path.join(dir_path,"temp/articles")
            #if path.exists(new_file): rmtree(new_file)
            make_archive(new_path, "zip", path.join(faszikel_dir, dir_name, "tex/articles"))
            return send_file(new_file)
        else:
            return send_file(faszikel_dir+f"/{dir_name}/tex/{file_name}")
    else:
        abort(401) # unauthorized

@app.route("/file/scan", methods=["POST"])
def scan_import():
    # upload scan imgs
    user = auth(request.headers.get("Authorization"))
    if "e_edit" in user["access"]:
        # check if path exists
        edition_id = request.form.get("edition_id", None)
        path_lst = request.form.get("path", "").strip("/").split("/")
        if edition_id==None or len(path_lst)!=2 or path.exists(dir_path+f"/content/scans/{path_lst[0]}/")==False:
            abort(400)
        dbPath = f"/{path_lst[0]}/{path_lst[1]}/"
        newPath = dir_path+"/content/scans"+dbPath
        if path.exists(newPath) == False: mkdir(newPath)

        # save imgs
        f_lst = request.files.getlist("files")
        r_lst = []
        aspect_ratio = None
        for f in f_lst:
            if path.exists(newPath + f.filename) == False:
                # create entry in db
                save_dict = {
                    "filename": f.filename[:4], # better: secure_filename(f.filename) // from werkzeug.utils import secure_filename
                    "path": dbPath
                }
                new_id = db.save("scan", save_dict)
                db.save("scan_lnk", {"scan_id": new_id, "edition_id": edition_id})
                # save file
                f.save(newPath + f.filename)
                if not aspect_ratio:
                    img = Image.open(f"{dir_path}/content/scans{save_dict['path']}{save_dict['filename']}.png")
                    w,h = img.size
                    aspect_ratio = str(1/h*w)[:5]
                    db.save("edition", {"aspect_ratio": aspect_ratio}, edition_id)
            else:
                r_lst.append(f.filename)
        return Response(json.dumps(r_lst), status=201) # created

    else: abort(401) # unauthorized

@app.route("/file/zettel", methods=["POST"])
def zettel_import():
    # uploading images for zettel-db
    user = auth(request.headers.get("Authorization"))
    u_letter = request.form.get("letter", "A")
    if len(u_letter) == 1 and u_letter.isalpha() and "z_add" in user["access"]:
        u_type = request.form.get("type", "0")
        f_path = dir_path + "/zettel/"
        if path.exists(f_path) == False: mkdir(f_path)
        f_path += f"{u_letter}/"
        if path.exists(f_path) == False: mkdir(f_path)

        c_user_id = user['id']
        if 'admin' in user['access'] and request.form.get("user_id_id", "") != "":
            c_user_id = request.form["user_id_id"]

        recto = True
        max_files = 1000
        if srv_set.doublesided == True: max_files = 500
        c_path = ""
        first_id = 0
        new_id = 0
        c_loop = 0
        f_lst = request.files.getlist("files")
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
                new_id = db.save("zettel", save_dict)
                if first_id == 0: first_id = new_id

                db.save("zettel", {
                    "img_folder": f"{(new_id-1)//max_files}",
                    "img_path": f"/zettel/{u_letter}/{(new_id-1)//max_files}/{new_id}"
                    },
                        new_id)
                # create subfolder so that no folder has more than 1'000 files
                c_path = f_path + f"{(new_id-1)//max_files}/"
                if path.exists(c_path) == False: mkdir(c_path)
                # save the file
                f.save(c_path + f"{new_id}.jpg")
                if srv_set.doublesided: recto = False
            else:
                f.save(c_path + f"{new_id}v.jpg")
                recto = True
        return Response(f"[{first_id},{new_id}]", status=201) # created
    else: abort(400) # bad request

@app.route("/zettel/<letter>/<dir_nr>/<img>")
def f_zettel(letter, dir_nr, img): # NOT SAVE!!!!!!!! NEEDS AUTH
    #self.auth()
    if cfg["connection"]["host"] == "localhost":
        return redirect(f"https://dienste.badw.de:9999/zettel/{letter}/{dir_nr}/{img}", code=302)
    else:
        return send_file(dir_path+f"/zettel/{letter}/{dir_nr}/"+img)

@app.route("/file/<f_type>/<res>")
def file_read(f_type, res):
    if f_type == "scan":
        user = auth(request.headers.get("Authorization"))
        if "library" in user["access"]:
            page = db.search("scan", {"id": res}, ["path", "filename"])[0]
            return send_file(dir_path + "/content/scans/" + page["path"] + "/" + page["filename"]+".png")
        else: abort(401)

# functions
@app.route("/exec/<res>", methods=["GET", "POST"])
def exec_on_server(res):
    user = auth(request.headers.get("Authorization"))
    if res == "opera_update" and "e_edit" in user["access"]:
        db.call("updateOperaLists")
        return Response("", status=200) # OK
    elif res == "statistics_update":
        db.call("updateStatistics")
        return Response("", status=200) # OK
    elif res == "mlw_preview" and "editor" in user["access"]:
        return create_mlw_file(request.json)
    elif res == "get_faszikel_jobs" and "faszikel" in user["access"]:
        return_list = []
        for sub_dir in listdir(faszikel_dir):
            if path.isdir(path.join(faszikel_dir, sub_dir)) and sub_dir != "last":
                # found sub directory
                pdf = False
                log = False
                if(path.exists(path.join(faszikel_dir, sub_dir, "tex"))):
                    for file in listdir(path.join(faszikel_dir, sub_dir, "tex")):
                        if file.endswith(".pdf"):
                            pdf = file
                        elif file.endswith(".log"):
                            log = True
                return_list.append({"date": sub_dir, "name": pdf, "log": log})
        return_list.sort(key=lambda item: item["date"], reverse=True)
        return json.dumps(return_list[:100])
    elif res == "ocr_job" and "ocr_jobs" in user["access"]:
        #check if ocr_job is already running.
        noOcrJob = True
        currentJob = db.search("ocr_jobs", {"finished": "NULL"}, ["id", "u_date"])
        for j in currentJob:
            if timedelta(hours=0, minutes=30) >= datetime.now()-j["u_date"]: noOcrJob = False
        if noOcrJob:
            converZettelThread = threading.Thread(target=auto.convertZettel, args=(50000,))
            converZettelThread.start()
            return Response("", status=200) # OK
        else: return abort(409) # Conflict: job already running!
    elif res == "ocr_job_scans" and "ocr_jobs" in user["access"]:
        #check if ocr_job is already running.
        noOcrJob = True
        currentJob = db.search("ocr_jobs", {"finished": "NULL"}, ["id", "u_date"])
        for j in currentJob:
            if timedelta(hours=0, minutes=30) >= datetime.now()-j["u_date"]: noOcrJob = False
        if noOcrJob:
            converZettelThread = threading.Thread(target=auto.ocr_scan, args=(50000,))
            converZettelThread.start()
            return Response("", status=200) # OK
        else: return abort(409) # Conflict: job already running!
    else: return abort(404) # not found

if __name__ == '__main__':
    logger=logging.getLogger(__name__)
    for item in Path(dir_path+"/static/temp").glob("*.*"): item.unlink() #cleanup temp folder
    server.start()