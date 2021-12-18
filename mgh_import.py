#!/user/bin/env python3
# -*- coding: utf-8 -*-
from configparser import ConfigParser
import json
from os import mkdir, path, remove
from PIL import Image
import requests
from shutil import copyfileobj
from sys import argv

from arachne import Arachne

dir_path = path.dirname(path.abspath(__file__))

#load cfg
if len(argv) > 1: cfg_path = argv[1]
else: cfg_path = dir_path+"/config/localhost.ini"
cfg = ConfigParser()
cfg.read(cfg_path)

# set db
search_cols = f"{dir_path}{cfg['default_path']['search_columns']}"
access_config = f"{dir_path}{cfg['default_path']['access_config']}"
db = Arachne(cfg['database'])

def get_MGH_img(url, page_name, res_path):
    file_path = f"{dir_path}/content/scans{res_path}"
    if not(path.exists(file_path)): mkdir(file_path)
    re = requests.get(url, stream=True, verify=False)
    if re.status_code == 200:
        re.raw.decode_content = True
        with open(f"{file_path}{page_name.zfill(4)}.jpg", "wb") as f:
            copyfileobj(re.raw, f)
        jpg = Image.open(f"{file_path}{page_name.zfill(4)}.jpg")
        jpg.save(f"{file_path}{page_name.zfill(4)}.png")
        remove(f"{file_path}{page_name.zfill(4)}.jpg")
        db.save("scan", {
            "filename": f"{page_name.zfill(4)}",
            "path": res_path,
            "mgh": url
            })
def setup_MGH_ressource(basic_url, ressource_path):
    # remove old scan-entries from database
    old_scan_lst = db.search("scan", {"path": ressource_path}, ["id"])
    for old_scan in old_scan_lst:
        db.delete("scan", {"id": old_scan["id"]})
    # get new pages
    edition_name = basic_url.split("/")[-2]
    re = requests.get(f"{basic_url}book.js", verify=False)
    start_index = re.text.find("var pages = ")
    end_index = re.text.find("\n", start_index)
    index = json.loads(re.text[start_index+12:end_index-1])
    for nr, page in enumerate(index):
        get_MGH_img(f"{basic_url}img/300/{edition_name}_{nr:05d}.jpg", page,ressource_path)

if __name__ == '__main__':
    setup_MGH_ressource("https://www.dmgh.de/mgh_ss_25/", "/M/MG Script. XXV (1880, ed. Heller)/")
    #setup_MGH_ressource("https://www.dmgh.de/mgh_poetae_1/", "/M/MG Poet. I (1881, ed. Dümmler)/")