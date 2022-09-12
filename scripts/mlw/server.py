from datetime import datetime, timedelta
from flask import abort, Response, request
import json
from pathlib import Path
from random import choices
from shutil import rmtree
import string
from sys import path as sysPath
import threading

def exec_mlw(res, user, db, dir_path):
    if res == "opera_update" and "e_edit" in user["access"]:
        db.call("updateOperaLists")
        return Response("", status=200) # OK
    elif res == "statistics_update":
        db.call("updateStatistics")
        return Response("", status=200) # OK
    elif res == "mlw_preview" and "editor" in user["access"]:
        return create_mlw_file(request.json, dir_path)
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
            converZettelThread = threading.Thread(target=auto.ocr_scan, args=(5000,))
            converZettelThread.start()
            return Response("", status=200) # OK
        else: return abort(409) # Conflict: job already running!
    else: return abort(404) # not found

def create_mlw_file(i_data, dir_path):
    sysPath.insert(1, dir_path + "/MLW-Software")
    from MLWCompiler import verarbeite_mlw_artikel
    
    random_temp_path = dir_path + "/temp/" + "".join(choices(string.ascii_uppercase+string.digits, k=10))
    Path(random_temp_path).mkdir(parents=True, exist_ok=True)
    with open(random_temp_path + "/input.mlw", "w") as i_file:
        i_file.write(i_data)
    verarbeite_mlw_artikel(random_temp_path +"/input.mlw")
    o_data = {}
    with open(random_temp_path + "/Ausgabe/HTML-Vorschau/input.html", "r") as html_file:
        o_data["html"] = html_file.read()
    #rmtree(random_temp_path)
    o_data["html"] = o_data["html"].replace(f"{random_temp_path}/input.mlw:", "")
    return json.dumps(o_data)