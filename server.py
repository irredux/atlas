#!/user/bin/env python3
# -*- coding: utf-8 -*-
from binascii import hexlify
from cheroot.wsgi import Server as WSGIServer, PathInfoDispatcher as WSGIPathInfoDispatcher
from cheroot.ssl.builtin import BuiltinSSLAdapter
from datetime import datetime, timedelta
from flask import abort, Flask, request, send_file, Response, session, redirect
from hashlib import pbkdf2_hmac
import json
import logging
from os import listdir, mkdir, makedirs, path, urandom
from pathlib import Path
from PIL import Image
import requests
from shutil import make_archive, rmtree
from sys import argv, stderr, stdout
import subprocess
import threading
from uuid import uuid4

from arachne import Arachne
from archimedes import Archimedes
from export import Exporter
from scripts.mlw.server import exec_mlw
from scripts.tll.server import exec_tll
from scripts.dom.server import exec_dom

############################## server setup
dir_path = path.dirname(path.abspath(__file__))
faszikel_dir = path.dirname("/local/ovc/MLW/export/processing/")

# load logger: redirect stdout and stderr to logfile!
class StreamToLogger(object):
    """
    Fake file-like stream object that redirects writes to a logger instance.
    """
    def __init__(self, logger, level):
       self.logger = logger
       self.level = level
       self.linebuf = ''

    def write(self, buf):
       for line in buf.rstrip().splitlines():
          self.logger.log(self.level, line.rstrip())

    def flush(self):
        pass
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s:%(levelname)s:%(name)s:%(message)s',
    filename=dir_path + "/dmlw.log",
    filemode='a'
)
logger = logging.getLogger(__name__)
stdout = StreamToLogger(logger,logging.INFO)
stderr = StreamToLogger(logger,logging.ERROR)

#load cfg
cfg_file_name = argv[1] if len(argv) > 1 else dir_path+"/config/localhost.json"
with open(cfg_file_name, "r") as cfg_file: cfg = json.load(cfg_file)
with open(dir_path+"/config/access.json", "r") as access_file: access_cfg = json.load(access_file)

# setup projects
for project in cfg["projects"]:
    cfg["projects"][project]["db"] = Arachne(cfg["projects"][project]["database"])
    cfg["projects"][project]["auto"] = Archimedes(cfg["projects"][project]["db"], dir_path)
    cfg["projects"][project]["exporter"] = Exporter(cfg["projects"][project]["db"], dir_path)
    cfg["projects"][project]["access"] = {
        "create": access_cfg[project]["create"],
        "read": access_cfg[project]["read"],
        "update": access_cfg[project]["update"],
        "delete": access_cfg[project]["delete"]
    }
    cfg["projects"][project]["access_tbls"] = {
        "create": access_cfg[project]["create"].keys(),
        "read": access_cfg[project]["read"].keys(),
        "update": access_cfg[project]["update"].keys(),
        "delete": access_cfg[project]["delete"].keys()
    }

# setup server
app = Flask(__name__)
secret_key = urandom(24)
secret_key = hexlify(secret_key)
app.config["SECRET_KEY"] = secret_key
if cfg["server"]["host"] == "localhost":
    from flask_cors import CORS # only for testing react apps locally!
    CORS(app)
server = WSGIServer((cfg["server"]["host"], int(cfg["server"]["port"])), WSGIPathInfoDispatcher({"/": app}))

if cfg["server"]["https"] == True: server.ssl_adapter = BuiltinSSLAdapter(cfg["server"]["certfile"], cfg["server"]["keyfile"], cfg["server"]["chainfile"])

# session parameters
cfg["server"]["session_hours"] = 4
cfg["server"]["session_minutes"] = 0

############################## assorted functions
def auth(project, c_session):
    access = ["auth"]
    logout = False
    if session.get("session", None) == None:
        if c_session == "" or c_session == None: abort(401) # unauthorized
        c_session = c_session[8:-1]
    else:
        c_session = session.get("session", None)
    usr_i = cfg["projects"][project]["db"].search("user", {"session": c_session}, ["id", "first_name",
        "last_name", "email", "session_last_active", "access", "settings", "password"])
    if len(usr_i) == 1:
        u_last = usr_i[0].get("session_last_active")
        u_access = set(json.loads(usr_i[0].get("access")))
        session_max = timedelta(hours=cfg["server"]["session_hours"], minutes=cfg["server"]["session_minutes"])
        update_after = timedelta(hours=0, minutes=10)
        if (session_max >= (datetime.now() - u_last) and logout == False and
                set(access).issubset(u_access)):
            # session ok
            if update_after <= (datetime.now() - u_last):
                cfg["projects"][project]["db"].save("user", {"session_last_active": datetime.now()},
                        usr_i[0].get("id"))
            usr_i[0]["access"] = json.loads(usr_i[0]["access"])
            return usr_i[0]
        else:
            # session is too old or logout
            cfg["projects"][project]["db"].save("user", {"session": ""}, usr_i[0].get("id"))
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
def login_check(user, pw, project):
    user_login = cfg["projects"][project]["db"].search("user", {"email": user}, ["id", "password",
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

############################## routes
@app.route("/")
@app.route("/<string:project>")
@app.route("/<string:project>/<string:app>")
@app.route("/<string:project>/<string:app>/<res>")
def login(project=None, app=None, res=None):
    params = []
    if project!=None: params.append(f"project={project}")
    if app!=None: params.append(f"app={app}")
    if app=="db":
        params.append(f"site={res}")
    elif app=="argos":
        params.append("site=edition")
        params.append(f"id={res}")
    if len(params)>0:
        params_txt = f"?{'&'.join(params)}"
    else:
        params_txt = ""
    return redirect(f"/static/index.html{params_txt}")
# session
@app.route("/<string:project>/session", methods=["POST"])
def session_create(project):
    email = request.json.get("user", "")
    password = request.json.get("password", "")
    if email != "" and password != "":
        user_login = login_check(email, password, project)
        if user_login != None:
            new_key = str(uuid4())
            data = {"session": new_key,
                    "session_last_active": str(datetime.now()),
                    "agent":request.headers.get('User-Agent')
                    }
            cfg["projects"][project]["db"].save("user", data, user_login["id"])
            session["session"] = data["session"]
            return Response(json.dumps(data["session"], default=str), status=201, mimetype="application/json")
        else: abort(401) # unauthorized
    else: abort(401) # unauthorized
@app.route("/<string:project>/session", methods=["GET"])
def session_read(project):
    user = auth(project,request.headers.get("Authorization"))
    r_user = {"id": user["id"], "first_name": user["first_name"],
            "last_name": user["last_name"], "email": user["email"], "access": user["access"]}
    return json.dumps(r_user)
@app.route("/<string:project>/session", methods=["DELETE"])
def session_delete(project):
    user = auth(project,request.headers.get("Authorization"))
    cfg["projects"][project]["db"].save("user", {"session": ""}, user["id"])
    return Response("", status=200)

# user
@app.route("/<string:project>/data/user", methods=["POST"])
def user_create(project):
    user = {"first_name": request.json.get("first_name", ""),
            "last_name": request.json.get("last_name", ""),
            "email": request.json.get("email", ""),
            "password": request.json.get("password", ""),
            "access": []}
    if (user["first_name"] != "" and user["last_name"] != "" and
            user["email"] != "" and user["password"] != ""):
        c_email = cfg["projects"][project]["db"].search("user", {"email": user["email"]}, ["id"])
        if len(c_email) == 0:
            user["password"] = pw_set(user["password"])
            cfg["projects"][project]["db"].save("user", user)
            return Response("", status=201) # CREATED
        else: abort(409) # CONFLICT
    else: abort(406) # NOT ACCEPTABLE
@app.route("/<string:project>/data/user/<int:id>", methods=["PATCH"])
def user_update(project,id):
    user = auth(project,request.headers.get("Authorization"))
    n_access = request.json.get("access", None)
    o_password = request.json.get("old_password", None)
    n_password = request.json.get("new_password", None)
    n_first_name = request.json.get("first_name", None)
    n_last_name = request.json.get("last_name", None)
    n_email = request.json.get("email", None)

    if n_access == None and n_password == None and n_email == None and n_first_name == None and n_last_name == None:
        abort(400)
    if n_access != None and "admin" in user["access"]:
        cfg["projects"][project]["db"].save("user", {"access": n_access}, id)
        return Response("", status=200) # OK
    elif n_access == None and n_password == None and id == user["id"]:
        n_values = {}
        if n_email != user["email"] and n_email != "" and n_email != None:
            if len(cfg["projects"][project]["db"].search("user", {"email": n_email}, ["id"])) == 0: n_values["email"] = n_email
            else: abort(409)
        elif n_email == "": abort(400)
        if n_first_name != user["first_name"] and n_first_name != "" and n_first_name != None:
            n_values["first_name"] = n_first_name
        elif n_first_name == "": abort(400)
        if n_last_name != user["last_name"] and n_last_name != "" and n_last_name != None:
            n_values["last_name"] = n_last_name
        elif n_last_name == "": abort(400)
        if len(n_values.keys()) > 0:
            cfg["projects"][project]["db"].save("user", n_values, id)
            return Response(status=200) # OK
        else: return Response(status=304) # not modified
    elif (n_password != None and o_password != None and
            id == user["id"] and pw_check(user["password"], o_password)):
        cfg["projects"][project]["db"].save("user", {"password": pw_set(n_password)}, id)
        return Response("", status=200) # OK
    else: abort(404)
@app.route("/<string:project>/data/user/<int:id>", methods=["DELETE"])
def user_delete(project,id):
    user = auth(project,request.headers.get("Authorization"))
    if "admin" in user["access"]:
        cfg["projects"][project]["db"].delete("user", {"id": id})
        return Response("", status=200) # OK
    else: abort(401)

# data
@app.route("/<string:project>/data/<res>", methods=["POST"])
def data_create(project, res, inData=None):
    user = auth(project, request.headers.get("Authorization"))
    if res not in cfg["projects"][project]["access_tbls"]["create"]: abort(404)
    for permission in cfg["projects"][project]["access"]["create"][res]:
        if permission["access"] in user["access"]:
            if inData == None: inData = request.json
            if permission.get("restricted", "") == "user_id":
                inData["user_id"] = user["id"]
            break
    else:
        abort(403) # forbidden
    r_id = cfg["projects"][project]["db"].save(res, inData)
    return Response(str(r_id), status=201, mimetype="text/plain") # created
@app.route("/<string:project>/data/<res>", methods=["GET"])
@app.route("/<string:project>/data/<res>/<int:res_id>", methods=["GET"])
def data_read(project, res, res_id=None, in_query=None, return_lst=False):
    user = auth(project, request.headers.get("Authorization"))
    if res not in cfg["projects"][project]["access_tbls"]["read"]: abort(404) # not found
    r_cols = ""
    v_cols = []
    user_id = ""
    for permission in cfg["projects"][project]["access"]["read"][res]:
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
    else: abort(403) # forbidden

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
                if type(q["v"]) is str and q["o"] != "REGEXP" and q["v"].find("*")>-1:
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
        results = cfg["projects"][project]["db"].command(sql, v_cols)
        if return_lst:
            return results
        else:
            return Response(json.dumps(results, default=str), mimetype="application/json")
    elif res_id == None:
        # sync with local db
        u_date = request.args.get("u_date", "2020-01-01 01:00:00")
        v_cols.append(u_date)
        results = cfg["projects"][project]["db"].command(f"SELECT {r_cols} FROM {res} WHERE{user_id} u_date > %s ORDER BY u_date ASC LIMIT 10000", v_cols)
        if return_lst:
            return results
        else:
            return Response(json.dumps(results, default=str), mimetype="application/json")
    else:
        # search with dataset id
        v_cols.append(res_id)
        results = cfg["projects"][project]["db"].command(f"SELECT {r_cols} FROM {res} WHERE{user_id} id = %s", v_cols)
        if return_lst:
            return results
        else:
            return Response(json.dumps(results, default=str), mimetype="application/json")
@app.route("/<string:project>/data/<res>/<int:res_id>", methods=["PATCH"])
def data_update(project, res, res_id, inData=None):
    # send 304 when item is not changed?
    user = auth(project, request.headers.get("Authorization"))
    if res not in cfg["projects"][project]["access_tbls"]["update"]: abort(404) # not found
    for permission in cfg["projects"][project]["access"]["update"][res]:
        if permission["access"] in user["access"]:
            if inData == None: inData = request.json
            if permission.get("restricted", "") == "user_id":
                if user["id"] == cfg["projects"][project]["db"].search(res, {"id": res_id}, ["user_id"])[0]["user_id"]:
                    break
            elif permission.get("restricted", "") == "shared_id":
                if (
                    user["id"] == cfg["projects"][project]["db"].search(res, {"id": res_id}, ["user_id"])[0]["user_id"] or
                    user["id"] == cfg["projects"][project]["db"].search(res, {"id": res_id}, ["shared_id"])[0]["shared_id"]
                ):
                    break
            else: break
    else: abort(403) # forbidden
    # doesnt throw error, if id doesnt exist in db!
    cfg["projects"][project]["db"].save(res, inData, res_id)
    return Response(str(res_id), status=200, mimetype="text/plain") # ok
@app.route("/<string:project>/data/<res>/<int:res_id>", methods=["DELETE"])
def data_delete(project, res, res_id):
    user = auth(project, request.headers.get("Authorization"))
    if res not in cfg["projects"][project]["access_tbls"]["delete"]: abort(404) # not found
    for permission in cfg["projects"][project]["access"]["delete"][res]:
        if permission["access"] in user["access"]:
            if permission.get("restricted", "") == "user_id":
                if user["id"] == cfg["projects"][project]["db"].search(res, {"id": res_id}, ["user_id"])[0]["user_id"]:
                    break
            elif permission.get("restricted", "") == "shared_id":
                if (
                    user["id"] == cfg["projects"][project]["db"].search(res, {"id": res_id}, ["user_id"])[0]["user_id"] or 
                    user["id"] == cfg["projects"][project]["db"].search(res, {"id": res_id}, ["shared_id"])[0]["shared_id"]
                ):
                    break
            else: break
    else: abort(403) # forbidden
    cfg["projects"][project]["db"].delete(res, {"id": res_id})
    return Response(str(res_id), status=200) # ok

# batch
@app.route("/<string:project>/data_batch/<res>", methods=["POST", "DELETE"]) # PATCH? ///  GET?
def data_batch(project, res):
    # should find a way to check the validity of the whole list before writing changes to db
    if res == "user": abort(403) # forbidden
    data = request.json
    if request.method == "POST":
        r_lst = []
        for d in data:
            if "id" in d:
                # update
                id = d["id"]
                del d["id"]
                re = data_update(project, res, id, d)
                if(re.status_code != 200): abort(re.status_code) # error
                r_lst.append(int(re.get_data(True)))
            else:
                # create
                re = data_create(project, res, d)
                if(re.status_code != 201): abort(re.status_code) # error
                r_lst.append(int(re.get_data(True)))
        return Response(json.dumps(r_lst), status=200, mimetype="application/json") # ok
    elif request.method == "DELETE":
        r_lst = []
        for d in data:
            re = data_delete(project, res, d)
            if(re.status_code != 200): abort(re.status_code) # error
            r_lst.append(int(re.get_data(True)))
        return Response(json.dumps(r_lst), status=200, mimetype="application/json") # ok
    else: abort(400) # bad request

# Export
@app.route("/<string:project>/export/<res>", methods=["GET"])
@app.route("/<string:project>/export/<res>/<int:res_id>", methods=["GET"])
def data_export(project, res, res_id=None, in_query=None):
    export_lst = data_read(project, res, res_id, in_query, return_lst=True)
    pdfFileName = exporter.create_pdf_from_zettel(export_lst)
    return Response(pdfFileName)

############## UNTESTED ROUTES!
# static files
@app.route("/<string:project>/zettel/<letter>/<dir_nr>/<img>")
def f_zettel(project, letter, dir_nr, img): # NOT SAVE!!!!!!!! NEEDS AUTH
    user = auth(project, request.headers.get("Authorization"))
    if cfg["server"]["host"] == "localhost":
        return redirect(f"https://dienste.badw.de:9999/{project}/zettel/{letter}/{dir_nr}/{img}", code=302)
    else:
        return send_file(f"{cfg['projects'][project]['zettel_dir']}/zettel/{letter}/{dir_nr}/{img}")
@app.route("/<string:project>/file/<res>/<res_id>")
def file_read(project, res, res_id):
    if res == "scan":
        user = auth(project, request.headers.get("Authorization"))
        if "library" in user["access"]:
            page = cfg["projects"][project]["db"].search("scan", {"id": res_id}, ["path", "filename"])[0]
            return send_file(cfg['projects'][project]['scans_dir']+ page["path"] + page["filename"]+".png")
            #return send_file(dir_path + "/content/scans" + page["path"] + page["filename"]+".png")
        else: abort(401)
    else: abort(404)
@app.route("/<string:project>/file/faszikel/<dir_name>/<file_name>/") # online mlw -> move to scripts.mlw.server?
def faszikel_export(project, dir_name, file_name):
    user = auth(project, request.headers.get("Authorization"))
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

# functions
@app.route("/<string:project>/exec/<res>", methods=["GET", "POST"])
def exec_on_server(project, res):
    user = auth(project, request.headers.get("Authorization"))
    if project=="mlw":
        return exec_mlw(res, user, cfg["projects"]["mlw"]["db"])
    elif project=="dom":
        return exec_dom(res, user, cfg["projects"]["mlw"]["db"])
    elif project=="tll":
        return exec_tll(res, user, cfg["projects"]["tll"]["db"])
    else: abort(404)

# import
@app.route("/<string:project>/file/scan", methods=["POST"])
def scan_import(project):
    # upload scan imgs
    user = auth(project, request.headers.get("Authorization"))
    if "e_edit" in user["access"]:
        # check if path exists
        edition_id = request.form.get("edition_id", None)
        path_lst = request.form.get("path", "").strip("/").split("/")
        if edition_id==None or len(path_lst)!=2:# or path.exists(f"{cfg['projects'][project]['scans_dir']}/{path_lst[0]}/")==False:
            abort(400)
        dbPath = f"/{path_lst[0]}/{path_lst[1]}/"
        newPath = cfg['projects'][project]['scans_dir']+dbPath
        if path.exists(newPath) == False: makedirs(newPath)

        # save imgs
        f_lst = request.files.getlist("files")
        r_lst = []
        aspect_ratio = None
        for f in f_lst:
            if path.exists(newPath + f.filename) == False:
                # create entry in db
                save_dict = {
                    "filename": f.filename[:-4], # better: secure_filename(f.filename) // from werkzeug.utils import secure_filename
                    "path": dbPath
                }
                new_id = cfg["projects"][project]["db"].save("scan", save_dict)
                cfg["projects"][project]["db"].save("scan_lnk", {"scan_id": new_id, "edition_id": edition_id})
                # save file
                f.save(newPath + f.filename)
                if not aspect_ratio:
                    img = Image.open(f"{cfg['projects'][project]['scans_dir']}{save_dict['path']}{save_dict['filename']}.png")
                    w,h = img.size
                    aspect_ratio = str(1/h*w)[:5]
                    cfg["projects"][project]["db"].save("edition", {"aspect_ratio": aspect_ratio}, edition_id)
            else:
                r_lst.append(f.filename)
        return Response(json.dumps(r_lst), status=201, mimetype="application/json") # created
    else: abort(401) # unauthorized
@app.route("/<string:project>/file/zettel", methods=["POST"])
def zettel_import(project):
    # uploading images for zettel-db
    user = auth(project, request.headers.get("Authorization"))
    u_letter = request.form.get("letter", "A")
    if len(u_letter) == 1 and u_letter.isalpha() and "z_add" in user["access"]:
        u_type = request.form.get("type", "0")
        f_path = f"{cfg['projects'][project]['zettel_dir']}/zettel/{u_letter}/"
        if path.exists(f_path) == False: makedirs(f_path)
        c_user_id = user['id']
        if 'admin' in user['access'] and request.form.get("user_id_id", "") != "":
            c_user_id = request.form["user_id_id"]

        recto = True
        max_files = 500 if cfg['projects'][project]["doublesided"] == True else 1000
        c_path = ""
        first_id = 0
        new_id = 0
        c_loop = 0
        f_lst = request.files.getlist("files")
        for f in f_lst:
            c_loop += 1
            if recto:
                # create entry in db
                save_dict = { "user_id": c_user_id, "letter": u_letter, "created_by": c_user_id, "in_use": True }
                if u_type != "0":
                    save_dict["type"] = u_type
                new_id = cfg["projects"][project]["db"].save("zettel", save_dict)
                if first_id == 0: first_id = new_id

                cfg["projects"][project]["db"].save("zettel", {
                    "img_folder": f"{(new_id-1)//max_files}",
                    "img_path": f"/zettel/{u_letter}/{(new_id-1)//max_files}/{new_id}"
                    },
                        new_id)
                # create subfolder so that no folder has more than 1'000 files
                c_path = f_path + f"{(new_id-1)//max_files}/"
                if path.exists(c_path) == False: mkdir(c_path)
                # save the file
                f.save(c_path + f"{new_id}.jpg")
                if cfg['projects'][project]["doublesided"]: recto = False
            else:
                f.save(c_path + f"{new_id}v.jpg")
                recto = True
        return Response(f"[{first_id},{new_id}]", status=201) # created
    else: abort(400) # bad request

# reroute
@app.route("/<string:project>/geschichtsquellen/<string:type>", methods=["GET"])
def reroute_geschichtsquellen(project, type):
    if type=="autoren":
        re = requests.get("http://geschichtsquellen.de/autor/data")
        return re.text
        #return open("./docs/mlw/geschichtsquellen_autoren.json", "r").read()
    else:
        re = requests.get("http://geschichtsquellen.de/werk/data")
        return re.text
        #return open("./docs/mlw/geschichtsquellen_werke.json", "r").read()
if __name__ == '__main__':
    for item in Path(dir_path+"/static/temp").glob("*.*"): item.unlink() #cleanup temp folder
    print("starting server...")
    server.start()