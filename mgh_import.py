#!/user/bin/env python3
# -*- coding: utf-8 -*-
from configparser import ConfigParser
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

def get_MGH_img(first_page, first_page_number, number_of_pages, basic_url, res_path):
    file_path = f"{dir_path}/content/scans{res_path}"
    if not(path.exists(file_path)): mkdir(file_path)
    for nr, page in enumerate(range(first_page, (first_page+number_of_pages))):
        re = requests.get(basic_url+f"{page:05d}.jpg", stream=True, verify=False)
        if re.status_code == 200:
            re.raw.decode_content = True
            with open(f"{file_path}{(first_page_number+nr):04d}.jpg", "wb") as f:
                copyfileobj(re.raw, f)
            jpg = Image.open(f"{file_path}{(first_page_number+nr):04d}.jpg")
            jpg.save(f"{file_path}{(first_page_number+nr):04d}.png")
            remove(f"{file_path}{(first_page_number+nr):04d}.jpg")
            db.save("scan", {
                "filename": f"{(first_page_number+nr):04d}",
                "path": res_path,
                "mgh": basic_url+f"{page:05d}.jpg"
                })
def setup_MGH_ressource(basic_url, ressource_path, pages_lst):
    # remove old scan-entries from database
    old_scan_lst = db.search("scan", {"path": ressource_path}, ["id"])
    for old_scan in old_scan_lst:
        db.delete("scan", {"id": old_scan["id"]})

    # download new imgs
    for pages in pages_lst:
        get_MGH_img(pages["img_number"], pages["page_number"], pages["count"], basic_url, ressource_path)
def import_mgh(): 
    setup_MGH_ressource( # K. Strecker MG Poet. IV (1923)
        "https://www.dmgh.de/mgh_poetae_4_23/img/300/mgh_poetae_4_23_",
        "/M/MG Poet IV (1923, ed. Strecker)/",
        2078,
        [
            {"img_number": 11, "page_number": 445, "count": 733},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
if __name__ == '__main__':
    setup_MGH_ressource( # P. v. Winterfeld MG Poet. IV (1899)
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/M/MG Script. rer. Germ. (1890, ed. v. Winterfeld)/",
        [
            {"img_number": 9, "page_number": 1, "count": 165},
            {"img_number": 174, "page_number": 165, "count": 1},
            {"img_number": 175, "page_number": 165, "count": 1},
            {"img_number": 176, "page_number": 166, "count": 279},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])