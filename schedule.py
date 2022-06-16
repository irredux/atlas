#!/user/bin/env python3
# -*- coding: utf-8 -*-
from configparser import ConfigParser
from os import path
from sys import argv
from arachne import Arachne
from archimedes import Archimedes

dir_path = path.dirname(path.abspath(__file__))
cfg = ConfigParser()
cfg.read(dir_path+"/config/dienstrechner.ini")

db = Arachne(cfg['database'])
auto = Archimedes(db, dir_path)

# refresh database
db.call("updateOperaLists")
db.call("updateStatistics")

# ocr and ML
auto.convertZettel(50000)
auto.ocr_scan(5000, False)