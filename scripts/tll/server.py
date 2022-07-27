from flask import abort, Response, request
from datetime import datetime, timedelta
import threading

def exec_tll(res, user, db):
    if res == "opera_update" and "e_edit" in user["access"]:
        db.call("updateOperaLists")
        return Response("", status=200) # OK
    elif res == "statistics_update":
        db.call("updateStatistics", ())
        return Response("", status=200) # OK
    elif res == "SortIndex" and "o_edit" in user["access"]:
        paras = request.json
        db.call("changeSortNr", paras)
        return Response("", status=200)
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