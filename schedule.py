#!/user/bin/env python3
# -*- coding: utf-8 -*-
#from configparser import ConfigParser
from os import path
from sys import argv
import json
from arachne import Arachne
from archimedes import Archimedes

dir_path = path.dirname(path.abspath(__file__))
#cfg = ConfigParser()
#cfg.read(dir_path+"/config/dienstrechner.ini")
#cfg_file_name = argv[1] if len(argv) > 1 else dir_path+"/config/localhost.json"
with open(dir_path+"/config/dienstrechner.json", "r") as cfg_file: cfg = json.load(cfg_file)

db = Arachne(cfg["projects"]["mlw"]["database"])
auto = Archimedes(db, dir_path)

# refresh database
db.call("updateOperaLists")
db.call("updateStatistics")

# ocr and ML
auto.convertZettel(50000)
auto.ocr_scan(5000, False)