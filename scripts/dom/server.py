from flask import abort, Response

def exec_dom(res, user, db):
    if res == "statistics_update":
        db.call("updateStatistics")
        return Response("", status=200) # OK
    else: return abort(404) # not found