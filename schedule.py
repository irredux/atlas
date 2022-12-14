#!/user/bin/env python3
# -*- coding: utf-8 -*-
from os import path
from sys import argv
import json
from arachne import Arachne
from archimedes import Archimedes

dir_path = path.dirname(path.abspath(__file__))
with open(dir_path+"/config/dienstrechner.json", "r") as cfg_file: cfg = json.load(cfg_file)

db = Arachne(cfg["projects"]["mlw"]["database"])
auto = Archimedes(db, dir_path)

# refresh database
#db.call("updateOperaLists")
#db.call("updateStatistics")

# ocr and ML
#auto.convertZettel(50000)
auto.ocr_scan(2000, False)