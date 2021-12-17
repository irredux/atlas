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
if __name__ == '__main__':
    pass
    #setup_MGH_ressource( # K. Strecker MG Poet. IV (1923)
    #    "https://www.dmgh.de/mgh_poetae_4_23/img/300/mgh_poetae_4_23_",
    #    "/M/MG Poet IV (1923, ed. Strecker)/",
    #    [
    #        {"img_number": 11, "page_number": 445, "count": 456},
    #        {"img_number": 471, "page_number": 901, "count": 276},
    #        {"img_number": 1, "page_number": 9000, "count": 2}
    #    ])


def import_mgh2():
    # F.-J. Schmale, Adalbertus Samaritanus, Praecepta dictaminum (MG Quellen z. Geistesgesch. d. Mittelalters III). 1961 <- welche seiten?
    # K. Hampe, Die Aktenstücke z. Frieden von S. Germano (MG Epist. sel. IV). 1926 -> Welche Seiten?
    # T. Schieffer, Die Urkunden der burgundischen Rudolfinger (MG regum Burgund. e stirpe Rudolf. diplomata et acta). 1977 -> Welche Seiten? https://www.dmgh.de/mgh_dd_rudolf/index.htm#page/92/mode/1up
    # F. Güterbock (MG Script. rer. Germ. N. S. VII)
    setup_MGH_ressource( # ACERB. MOR. hist. 130–76
        "https://www.dmgh.de/mgh_ss_rer_germ_n_s_7/img/300/mgh_ss_rer_germ_n_s_7_",
        "/A/ACERB. MOR. hist. (ed. Güterbock)/",
        2068,
        [
            {"img_number": 175, "page_number": 130, "count": 47},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # HIST. Frid. imp. cont. 177–218
        "https://www.dmgh.de/mgh_ss_rer_germ_n_s_7/img/300/mgh_ss_rer_germ_n_s_7_",
        "/H/HIST. Frid. imp. cont. (ed. Güterbock)/",
        2494,
        [
            {"img_number": 222, "page_number": 177, "count": 42},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # HIST. Frid. imp. retr. 1–218 # warum hier auch 218???
        "https://www.dmgh.de/mgh_ss_rer_germ_n_s_7/img/300/mgh_ss_rer_germ_n_s_7_",
        "/H/HIST. Frid. imp. retr. (ed. Güterbock)/",
        2495,
        [
            {"img_number": 46, "page_number": 1, "count": 218},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # OTTO MOR. hist. 1–129 # siehe oben???
        "https://www.dmgh.de/mgh_ss_rer_germ_n_s_7/img/300/mgh_ss_rer_germ_n_s_7_",
        "/O/OTTO MOR. hist. (ed. Güterbock)/",
        2631,
        [
            {"img_number": 46, "page_number": 1, "count": 129},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
 