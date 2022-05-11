#!/user/bin/env python3
# -*- coding: utf-8 -*-
from configparser import ConfigParser
from os import path
from sys import argv
from arachne import Arachne
from archimedes import Archimedes

dir_path = path.dirname(path.abspath(__file__))

#load cfg
if len(argv) > 1: cfg_path = argv[1]
else: cfg_path = dir_path+"/config/localhost.ini"
cfg = ConfigParser()
cfg.read(cfg_path)


# set db
db = Arachne(cfg['database'])
auto = Archimedes(db, dir_path)

auto.ocr_scan(1000)