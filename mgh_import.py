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
        re = requests.get(basic_url+f"{page:05d}.jpg", stream=True)
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

def setup_MGH_ressource(basic_url, ressource_path, edition_id, pages_lst):
    # check if img_path exists in db??
    # download imgs
    for pages in pages_lst:
        get_MGH_img(pages["img_number"], pages["page_number"], pages["count"], basic_url, ressource_path)
    # create new ressource based on old informations
    old_res = db.search("edition", {"id": edition_id})
    new_res = old_res[0]
    new_res["path"] = ressource_path
    new_res["url"] = None
    new_res["bsb"] = None
    del new_res["id"]

    new_res_id = db.save("edition", new_res, edition_id)
    # add imgs to new edition
    new_imgs = db.search("scan", {"path": ressource_path}, ["id"])
    for new_img in new_imgs:
        db.save("scan_lnk", {"edition_id": new_res_id, "scan_id": new_img["id"]})

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
    
def import_mgh3():
    # O. Holder-Egger MG Script. XV (1887)
    setup_MGH_ressource( # ADREV. Bened. 478–97
        "https://www.dmgh.de/mgh_ss_15_1/img/300/mgh_ss_15_1_",
        "/A/ADREV. Bened. (ed. Holder-Egger)/",
        2074,
        [
            {"img_number": 486, "page_number": 478, "count": 20},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # BOVO SITH. Bert. 525–34
        "https://www.dmgh.de/mgh_ss_15_1/img/300/mgh_ss_15_1_",
        "/B/BOVO SITH. Bert. (ed. Holder-Egger)/",
        2892,
        [
            {"img_number": 533, "page_number": 525, "count": 10},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # ERMENR. Sval. 153–63
        "https://www.dmgh.de/mgh_ss_15_1/img/300/mgh_ss_15_1_",
        "/E/ERMENR. Sval. (ed. Holder-Egger)/",
        2369,
        [
            {"img_number": 161, "page_number": 153, "count": 11},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # FOLCUIN. vita Folcuin. 424–30
        "https://www.dmgh.de/mgh_ss_15_1/img/300/mgh_ss_15_1_",
        "/F/FOLCUIN. vita Folcuin. (ed. Holder-Egger)/",
        2380,
        [
            {"img_number": 432, "page_number": 424, "count": 7},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # HUGEB. Willib. 86–106
        "https://www.dmgh.de/mgh_ss_15_1/img/300/mgh_ss_15_1_",
        "/H/HUGEB. Willib. (ed. Holder-Egger)/",
        2531,
        [
            {"img_number": 94, "page_number": 86, "count": 21},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # LIUTG. Greg. 66–79
        "https://www.dmgh.de/mgh_ss_15_1/img/300/mgh_ss_15_1_",
        "/L/LIUTG. Greg. (ed. Holder-Egger)/",
        2587,
        [
            {"img_number": 73, "page_number": 66, "count": 14},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # LUP. FERR. Wigb. 37–43
        "https://www.dmgh.de/mgh_ss_15_1/img/300/mgh_ss_15_1_",
        "/L/LUP. FERR. Wigb. (ed. Holder-Egger)/",
        2595,
        [
            {"img_number": 44, "page_number": 37, "count": 7},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # MEGINH. BLEID. Ferr. 149–50
        "https://www.dmgh.de/mgh_ss_15_1/img/300/mgh_ss_15_1_",
        "/M/MEGINH. BLEID. Ferr. (ed. Holder-Egger)/",
        2603,
        [
            {"img_number": 157, "page_number": 149, "count": 2},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # ODBERT. Frid. 344–56
        "https://www.dmgh.de/mgh_ss_15_1/img/300/mgh_ss_15_1_",
        "/L/LUP. FERR. Wigb. (ed. Holder-Egger)/",
        2603,
        [
            {"img_number": 157, "page_number": 149, "count": 2},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    # B. Schmeidler, Adam von Bremen, Hamburgische Kirchengesch. (MG Script. rer. Germ.). 1917.
    setup_MGH_ressource( # ADAM gest. 1–280
        "https://www.dmgh.de/mgh_ss_rer_germ_2/img/300/mgh_ss_rer_germ_2_",
        "/A/ADAM gest. (ed. Schmeidler)/",
        2073,
        [
            {"img_number": 68, "page_number": 1, "count": 280},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # ADAM gest. epil. 281–83
        "https://www.dmgh.de/mgh_ss_rer_germ_2/img/300/mgh_ss_rer_germ_2_",
        "/A/ADAM gest. (epil.) (ed. Schmeidler)/",
        2959,
        [
            {"img_number": 348, "page_number": 1, "count": 3},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # SCHOL. Adam gest. (in notis) 4–274
        "https://www.dmgh.de/mgh_ss_rer_germ_2/img/300/mgh_ss_rer_germ_2_",
        "/S/SCHOL. Adam gest. (in notis) (ed. Schmeidler)/",
        2679,
        [
            {"img_number": 71, "page_number": 4, "count": 271},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    # F. Kurze, Reginonis ... chronicon (MG Script. rer. Germ.). 1890. p. 154-79
    setup_MGH_ressource( # ADALB. MAGD. chron. 154–79
        "https://www.dmgh.de/mgh_ss_rer_germ_50/img/300/mgh_ss_rer_germ_50_",
        "/A/ADALB. MAGD. chron. (ed. Kurze)/",
        2071,
        [
            {"img_number": 173, "page_number": 154, "count": 26},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # REGINO chron. 1–153
        "https://www.dmgh.de/mgh_ss_rer_germ_50/img/300/mgh_ss_rer_germ_50_",
        "/R/REGINO chron. (ed. Kurze)/",
        2655,
        [
            {"img_number": 20, "page_number": 1, "count": 153},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # REGINO chron. app. 180
        "https://www.dmgh.de/mgh_ss_rer_germ_50/img/300/mgh_ss_rer_germ_50_",
        "/R/REGINO chron. (app.) (ed. Kurze)/",
        2958,
        [
            {"img_number": 199, "page_number": 180, "count": 1},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    # P. v. Winterfeld MG Poet. IV (1899)
    setup_MGH_ressource( # ARBO SANGERM. bell. 77–122
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/A/ARBO SANGERM. bell (ed. v. Winterfeld)/",
        2067,
        [
            {"img_number": 85, "page_number": 77, "count": 46},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # CARM. de Bened. 209–31
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/C/CARM. de Bened. (ed. v. Winterfeld)/",
        2954,
        [
            {"img_number": 219, "page_number": 209, "count": 23},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # CARM. de Cass. 181–96
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/C/CARM. de Cass. (ed. v. Winterfeld)/",
        2955,
        [
            {"img_number": 191, "page_number": 181, "count": 16},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # CARM. de Lamb. 142–59
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/C/CARM. de Lamb. (ed. v. Winterfeld)/",
        2207,
        [
            {"img_number": 150, "page_number": 142, "count": 18},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # CARM. de Quint. 197–208
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/C/CARM. de Quint. (ed. v. Winterfeld)/",
        2216,
        [
            {"img_number": 207, "page_number": 197, "count": 12},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # CARM. de Quint. 197–208
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/C/CARM. de Quint. (ed. v. Winterfeld)/",
        2216,
        [
            {"img_number": 207, "page_number": 197, "count": 12},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # EUGEN. VULG. syll. 412–40
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/E/EUGEN. VULG. syll. (ed. v. Winterfeld)/",
        2373,
        [
            {"img_number": 422, "page_number": 412, "count": 29},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # EUGEN. VULG. syll. (app.) 441–44
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/E/EUGEN. VULG. syll. (app.) (ed. v. Winterfeld)/",
        2956,
        [
            {"img_number": 451, "page_number": 441, "count": 4},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # GESTA Bereng. 355–401
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/G/GESTA Bereng. (ed. v. Winterfeld)/",
        2428,
        [
            {"img_number": 365, "page_number": 355, "count": 47},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # HUCBALD. carm. 265–73
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/H/HUCBALD. carm. (ed. v. Winterfeld)/",
        2528,
        [
            {"img_number": 275, "page_number": 265, "count": 9},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # HUCBALD. carm. app. 274–75
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/H/HUCBALD. carm. (app.) (ed. v. Winterfeld)/",
        2957,
        [
            {"img_number": 284, "page_number": 274, "count": 2},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # LIOS MON. 278–95
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/L/LIOS MON. (ed. v. Winterfeld)/",
        2586,
        [
            {"img_number": 288, "page_number": 278, "count": 18},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # POETA SAXO 7–71
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/P/POETA SAXO (ed. v. Winterfeld)/",
        2641,
        [
            {"img_number": 15, "page_number": 7, "count": 65},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # RADBOD. carm. 162–73
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/R/RADBOD. carm. (ed. v. Winterfeld)/",
        2647,
        [
            {"img_number": 170, "page_number": 162, "count": 12},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # SALOM. III. carm. I 297–310
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/S/SALOM. III. carm. I (ed. v. Winterfeld)/",
        2678,
        [
            {"img_number": 307, "page_number": 297, "count": 14},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # SYLL. Bern. 243–61
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/S/SYLL. Bern. (ed. v. Winterfeld)/",
        2702,
        [
            {"img_number": 253, "page_number": 243, "count": 19},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # WALDR. carm. 310–14
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/S/SYLL. Bern. (ed. v. Winterfeld)/",
        2857,
        [
            {"img_number": 320, "page_number": 310, "count": 5},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    # K. Strecker MG Poet. IV (1923)
    setup_MGH_ressource( # AGIUS comput. p. 937-43
        "https://www.dmgh.de/mgh_poetae_4_23/img/300/mgh_poetae_4_23_",
        "/A/AGIUS comput. (ed. Strecker)/",
        2078,
        [
            {"img_number": 507, "page_number": 937, "count": 7},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # CARM. Augiens. p. 1112-16
        "https://www.dmgh.de/mgh_poetae_4_23/img/300/mgh_poetae_4_23_",
        "/C/CARM. Augiens. (ed. Strecker)/",
        2195,
        [
            {"img_number": 682, "page_number": 1112, "count": 5},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # CARM. libr. II 1056–72
        "https://www.dmgh.de/mgh_poetae_4_23/img/300/mgh_poetae_4_23_",
        "/C/CARM. libr. II (ed. Strecker)/",
        2209,
        [
            {"img_number": 626, "page_number": 1056, "count": 17},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # CARM. de Nyn. 944–61
        "https://www.dmgh.de/mgh_poetae_4_23/img/300/mgh_poetae_4_23_",
        "/C/CARM. de Nyn. (ed. Strecker)/",
        2213,
        [
            {"img_number": 514, "page_number": 944, "count": 18},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # CARM. Sangall. II 1092.1108–12
        "https://www.dmgh.de/mgh_poetae_4_23/img/300/mgh_poetae_4_23_",
        "/C/CARM. Sangall. II (ed. Strecker)/",
        2219,
        [
            {"img_number": 662, "page_number": 1092, "count": 1},
            {"img_number": 678, "page_number": 1108, "count": 5},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # CARM. Scot. II 1119–27
        "https://www.dmgh.de/mgh_poetae_4_23/img/300/mgh_poetae_4_23_",
        "/C/CARM. Scot. II (ed. Strecker)/",
        2222,
        [
            {"img_number": 689, "page_number": 1119, "count": 9},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # CARM. var. II 1074–90
        "https://www.dmgh.de/mgh_poetae_4_23/img/300/mgh_poetae_4_23_",
        "/C/CARM. var. II (ed. Strecker)/",
        2227,
        [
            {"img_number": 644, "page_number": 1074, "count": 17},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # EPITAPH. var. I 1026–42
        "https://www.dmgh.de/mgh_poetae_4_23/img/300/mgh_poetae_4_23_",
        "/E/EPITAPH. var. I (ed. Strecker)/",
        2363,
        [
            {"img_number": 596, "page_number": 1026, "count": 17},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # HRABAN. carm. euang. 928–29
        "https://www.dmgh.de/mgh_poetae_4_23/img/300/mgh_poetae_4_23_",
        "/H/HRABAN. carm. euang. (ed. Strecker)/",
        2507,
        [
            {"img_number": 498, "page_number": 928, "count": 2},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # IOH. DIAC. cen. 872–900
        "https://www.dmgh.de/mgh_poetae_4_23/img/300/mgh_poetae_4_23_",
        "/I/IOH. DIAC. cen. (ed. Strecker)/",
        2542,
        [
            {"img_number": 438, "page_number": 872, "count": 29},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # RHYTHM. 455–856
        "https://www.dmgh.de/mgh_poetae_4_23/img/300/mgh_poetae_4_23_",
        "/R/RHYTHM. (ed. Strecker)/",
        2661,
        [
            {"img_number": 21, "page_number": 455, "count": 402},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # TIT. metr. III 1043–55
        "https://www.dmgh.de/mgh_poetae_4_23/img/300/mgh_poetae_4_23_",
        "/T/TIT. metr. III (ed. Strecker)/",
        2715,
        [
            {"img_number": 613, "page_number": 1043, "count": 13},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # VULF. Marc. II 965–76
        "https://www.dmgh.de/mgh_poetae_4_23/img/300/mgh_poetae_4_23_",
        "/V/VULF. Marc. II (ed. Strecker)/",
        2848,
        [
            {"img_number": 535, "page_number": 965, "count": 12},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])

def import_mgh(): 
    setup_MGH_ressource( # O. Holder-Egger MG Script. XV (1887)
        "https://www.dmgh.de/mgh_ss_15_1/img/300/mgh_ss_15_1_",
        "/M/MG Script. XV (1887, ed. Holder-Egger)/",
        2074,
        [
            {"img_number": 8, "page_number": 1, "count": 574},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # B. Schmeidler, Adam von Bremen, Hamburgische Kirchengesch. (MG Script. rer. Germ.). 1917.
        "https://www.dmgh.de/mgh_ss_rer_germ_2/img/300/mgh_ss_rer_germ_2_",
        "/M/MG Script rer. Germ. (1917, ed. Schmeidler)/",
        2073,
        [
            {"img_number": 68, "page_number": 1, "count": 353},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # F. Kurze, Reginonis ... chronicon (MG Script. rer. Germ.). 1890. p. 154-79
        "https://www.dmgh.de/mgh_ss_rer_germ_50/img/300/mgh_ss_rer_germ_50_",
        "/M/MG Script. rer. Germ. (1890, ed. Kurze)/",
        2071,
        [
            {"img_number": 20, "page_number": 1, "count": 196},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # P. v. Winterfeld MG Poet. IV (1899)
        "https://www.dmgh.de/mgh_poetae_4_1/img/300/mgh_poetae_4_1_",
        "/M/MG Script. rer. Germ. (1890, ed. v. Winterfeld)/",
        2067,
        [
            {"img_number": 9, "page_number": 1, "count": 444},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
    setup_MGH_ressource( # K. Strecker MG Poet. IV (1923)
        "https://www.dmgh.de/mgh_poetae_4_23/img/300/mgh_poetae_4_23_",
        "/M/MG Poet IV (1923, ed. Strecker)/",
        2078,
        [
            {"img_number": 11, "page_number": 445, "count": 733},
            {"img_number": 1, "page_number": 9000, "count": 2}
        ])
if __name__ == '__main__':
    import_mgh()