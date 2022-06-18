from configparser import ConfigParser
from os import path
from sys import argv

from cltk import NLP

from arachne import Arachne
from archimedes import Archimedes

dir_path = path.dirname(path.abspath(__file__))
cfg = ConfigParser()
cfg.read(dir_path+"/config/localhost.ini")

db = Arachne(cfg['database'])

zettel = db.search("zettel", {"id": 28708}); #Abbo Flor. calc.
print(zettel[0]["ocr_text"])
print("*"*50)

cltk_nlp = NLP(language="lat")
cltk_doc = cltk_nlp.analyze(text=zettel[0]["ocr_text"])
print(cltk_doc.tokens)
print("*"*50)
print(cltk_doc.lemmata)