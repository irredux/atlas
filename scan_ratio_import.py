#!/user/bin/env python3
# -*- coding: utf-8 -*-
from configparser import ConfigParser
from os import mkdir, path, remove
from PIL import Image
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

def get_ratio(img_path):
    img = Image.open(img_path)
    w,h = img.size

    return str(1/h*w)[:5]

if __name__ == '__main__':
    scan_lst = db.command("SELECT scan.id,scan.path,scan_lnk.edition_id,scan.filename FROM scan LEFT JOIN scan_lnk ON scan_lnk.scan_id = scan.id WHERE scan_lnk.edition_id IS NOT NULL GROUP BY scan_lnk.edition_id")
    print(len(scan_lst))
    for scan in scan_lst:
        try: 
            ratio = get_ratio(f"{dir_path}/content/scans{scan['path']}{scan['filename']}.png")
        except FileNotFoundError:
            print(f"File not found with id: {scan['id']}")
        else:
            print(scan["id"], ratio)
            db.command(f"UPDATE edition SET aspect_ratio={ratio} WHERE id = {scan['edition_id']}")