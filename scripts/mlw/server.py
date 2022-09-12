from flask import abort, Response, request
from datetime import datetime, timedelta
import json
from os import path
from sys import path as sysPath
from shutil import rmtree
import subprocess
import threading
from time import sleep

sysPath.insert(1, "/Users/alexanderhaberlin/projects/dMLW/atlas-server/MLW-Software")
from MLWCompiler import verarbeite_mlw_artikel

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
    with open(dir_path + "/MLW-Software/input.mlw", "w") as i_file:
        i_file.write(i_data)
    re = verarbeite_mlw_artikel("input.mlw")
    with open(dir_path + "/MLW-Software/Ausgabe/HTML-Vorschau/input.html", "r") as html_file:
        o_data = html_file.read()
    return json.dumps(o_data)


    # o_datas = []
    # with open(dir_path + "/MLW-Software/input.mlw", "w") as i_file:
    #     i_file.write(i_data)
    # if path.exists(dir_path + "/MLW-Software/Ausgabe"): rmtree(dir_path + "/MLW-Software/Ausgabe")
    # subprocess.run(
    #         f"python3 {dir_path}/MLW-Software/MLWServer.py --port 9997",
    #         shell=True)
    # sleep(1)
    # subprocess.run(
    #         f"python3 {dir_path}/MLW-Software/MLWServer.py --port 9997 {dir_path}/MLW-Software/input.mlw",
    #         shell=True)
    # o_data = {}
    # with open(dir_path + "/MLW-Software/Ausgabe/HTML-Vorschau/input.html", "r") as html_file:
    #     o_data["html"] = html_file.read()
    # o_datas.append(o_data)

    #subprocess.run(f"python3 {dir_path}/MLW-Software/MLWServer.py --port 9997 --stopserver", shell=True)
    #return json.dumps(o_datas)