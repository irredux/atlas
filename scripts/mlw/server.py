from flask import abort, Response

def exec_mlw(res, user, db):
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
            converZettelThread = threading.Thread(target=auto.ocr_scan, args=(5000,))
            converZettelThread.start()
            return Response("", status=200) # OK
        else: return abort(409) # Conflict: job already running!
    else: return abort(404) # not found