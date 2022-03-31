#!/user/bin/env python3
# -*- coding: utf-8 -*-
from fuzzysearch import find_near_matches
from joblib import load
from os import path
import pandas
from PIL import Image
import pytesseract
import re

ie_addition = [
    # on zettel     new ac_web      new work_id     zettel_type
    #["ADALB. AUGUST.", "ADILB. AUGUST."],
    ["ADALB. BAMB. Heinr.", "VITA Heinr. II. B", 2216, None],
    ["ADALB. ULTR. Heinr.", "ADALBOLD. Heinr.", 24, None],
    ["ADALB. ULTR. in Boeth.", "ADALBOLD. Boeth.", 23, None],
    ["ALDHELMI opera Index", None, None, 6],
    ["AEG. ZAM. mus.", "IOH. AEGID. mus.", 1439, None],
    ["ALBERT. M. alch.", "PS. ALBERT. M. alch.", 1722, None],
    ["ALBERT. M. eth. comm.", "ALBERT. M. eth. I", 62, None],
    ["ALBERT. M. eth.", "ALBERT. M. eth. II", 63, None],
    ["ALBERT. STAD. annal.", "ALBERT. STAD. chron.", 118, None],
    ["ALCUIN. (?) mus.", "PS. ALCUIN. mus.", 1724, None],
    #["ALDH.", "\[ALDH.\]"],
    ["ALMA index vol. XXV", None, None, 4],
    ["AMALAR. op. lit. ind. phil.", None, None, 6],
    ["ANGILB. ad Arnon.", "EPIST. Alcuin.", 985, None],
    #["ANNAL. Sen.", "ANNAL. Senon."],
    #["ANON. de Alleg.", "ALLEG. dom. (olim I/1/S.88)/ALLEG. cam. (olim II/2/S.89/90)"],
    ["ANON. med. falc. Verc.", "FRAGM. med. falc.", 1090, None],
    ["ARNO (?) ad Leon.", "FORM. Salisb. I", 1079, None],
    ["ARNOLD. SAXO fin.", "ARNOLD. SAXO flor.", 328, None],
    #["AURORA CONSURG.", "\[AURORA CONSURG.\]"],
    ["BALDUIN. vict. dict.", "BALDW. vict. dict", 344, None],
    ["BEBO ad Heinr.", "BEBO ad Heinr. II", 347, None],
    #["BEDA hist. eccl.", "\[BEDA hist. eccl.\]"],
    #["BENVEN. GRAFF. ocul.", "BENVEN. GRAFF. ocul. A (bei Seitenzahl steht a/b dabei) / B"],
    #["BERN. CONST. ...", "BERNOLD. CONST. ..."],
    ["BERN. CONST. chron.", "BERNOLD. CONST. chron.", 375, None],
    #["BERN. CONST. incont.", "BERNOLD. CONST. libell. (Seitenzahl beachten!)"],
    #["BERN. WAT. ...", "BERNOLD. WAT. ..."],
    #["BERTH. Augiens.", "BERTH. chron. A (S. 730–732)/B (S. 267–326)"],
    ["BOVO in Boeth.", "BOVO CORB. Boeth.", 395, None],
    ["BRUNI LONGOBURG. chirurg.", "BRUNUS LONG. chirurg.", 404, None],
    #["BURCH. ARGENT. itin.", "BURCH. ARGENT. itin. A (S. 58–61) / B (S. 63–69)"],
    ["CAND. (?) ad amic. 1", "EPIST. Alcuin.", 985, None],
    ["CAND. ad amic. 2", "EPIST. var. I", 1021, None],
    ["CAND. (WIZO) ad imp.", "EPIST. var. II suppl. 1", 1022, None],
    ["CARM. ad Hadw.", "CARM. var. III A", 495, None],
    ["CARM. anon.", "\[CARM. anon.\]; (SBMünch. 1873. p. 742)", 2704, None],
    #["CARM. Cantabr.", "CARM. Cantabr. A, wenn Index"],
    ["CARM. de conv. Saxon.", "PAULIN. AQUIL. (?) conv. Saxon.", 1696, None],
    ["CARM. ined.", "CARM. var.; 83,9 (ed. H. Hagen. 1877. p. 141)", 2775, None],
    ["CARM. Salisb.", "CARM. Salisb. I", 481, None],
    ["CATAL. archiep. Col. II", "CATAL. Col. (MGScript. XXIV p. 356,25)", 2790, None],
    ["CATAL. biblioth. Ineichen-Eder", "CATAL. biblioth. A", 506, None],
    ["CATAL. biblioth. Lehm.", "CATAL. biblioth. A", 506, None],
    ["CATAL. biblioth. Ruf.", "CATAL. biblioth. A", 506, None],
    ["CATAL. biblioth. Salisb.", "CATAL. biblioth. B", 507, None],
    ["CATAL. biblioth. Stir.", "CATAL. biblioth. B", 507, None],
    ["CATAL. biblioth. Gottlieb", "CATAL. biblioth. B", 507, None],
    ["CATAL. thes. Pruf.", "CATAL. thes. Germ.", 517, None],
    ["CHART. Asbac.", "CHART. Asp.", 532, None],
    ["CHART. Basil. I", "CHART. Basil. A", 536, None],
    ["CHART. Basil. II", "CHART. Basil. B", 537, None],
    ["CHART. Basil. III", "CHART. Basil. C", 538, None],
    ["CHART. Bonn.", "CHART. Rhen.", 667, None],
    ["CHART. Burgund.", "ACTA reg. Burgund.", 17, None],
    ["CHART. Chil.", "ACTA civ. Kil.", 7, None],
    ["CHART. Frauens.", "CHART. Lac.", 624, None],
    ["CHART. mon. in Berga (Magd.)", "CHART. Berg. Magd.", 539, None],
    ["CHART. mon. Fuld. B", "CHART. Fuld. B", 602, None],
    ["CHART. mon. Mar. (Magd.)", "CHART. Mar. Magd.", 636, None],
    #["CHART. Naumb.", "wahrscheinlich CHART. Naumb. I (wenn Zettel vor 2000)"],
    ["CHART. Rost.", "ACTA civ. Rost.", 8, None],
    ["CHART. S. Ioh. Ratisb.", "CHART. Ioh. Ratisb.", 622, None],
    ["CHART. Sangall. I", "CHART. Sangall. A", 678, None],
    ["CHART. Sangall. II", "CHART. Sangall. B", 679, None],
    ["CHART. Silv. gesta Trev.", "GESTA Trev.", 1192, None],
    ["CHART. Tirol.", "CHART. Tirol. I", 710, None],
    ["CHART. Wism. A", "Acta. civ. Wism. A", 9, None],
    ["CHART. Wism. B", "Acta. civ. Wism. B", 10, None],
    ["CHRON. Lauresh.", "COD. Lauresh.", 795, None],
    ["CHRON. Ortl.", "ORTL. chron.", 1662, None],
    ["COMPUT. cod. Bern.", "COMPUT. Borst.", 809, None],
    ["CONC. Dingolf.", "CONC. Karol. A", 812, None],
    ["CONC. Karol.", "CONC. Karol. A", 812, None],
    ["CONC. Neuch. A/B", "CONC. Karol. A", 812, None],
    ["CONF. ovis et lini", "WINR. confl.", 2395, None],
    ["CONR. HIRS. didasc.", "CONR. HIRS. dial.", 831, None],
    ["CONR. MUR. nat. animal.", "CARM. de nat. animal.", 470, None],
    ["CONR. SCHIR. catal.", "CATAL. cod. Conr. Schir.", 514, None],
    #["CHRON. Cosmae cont.", "CHRON. Cosmae cont. I (S. 132–148, bis Zeile 24)/II (S. ab Zeile 25, 148–163)"],
    ["CONST. I", "CONST. imp. I", 847, None],
    ["CONST. II", "CONST. imp. II", 848, None],
    ["CONST. III", "CONST. imp. III", 849, None],
    ["CONSUET. Springirsb.-Rod.", "CONSUET. Rod.", 863, None],
    ["Corpus consuet. monast. I.", None, None, 6],
    ["DIAETA Sangall.", "PRAECEPT. diaet.", 1718, None],
    ["DIPL. Conr. regis", "DIPL. Conr. 5 (MGDipl. reg. et imp. Germ. VI 2. 1959. p. 676,19)", 3023, None],
    ["DIPL. Karolin.", "DIPL. Karoli M.", 903, None],
    ["DIPL. Loth. I. II.", None, None, 6],
    ["DIPL. Merov. cf. J. VIEILLARD", None, None, 3],
    ["DHUODA epigr.", "DHUODA lib. man.", 882, None],
    ["EKKEH. V. Notker.", "VITA Notkeri", 2268, None],
    ["EKKEH. bened. I", "EKKEH. IV. bened. I", 961, None],
    ["EKKEH. cas.", "EKKEH. IV. cas.", 966, None],
    ["EKKEH. pict. Sangall", "EKKEH. IV. pict. Sangall", 968, None],
    ["ENGELH. WIRZ. Burch.", "EKKEH. URAUG. Burch.", 971, None],
    ["EPIST. ad Hildeg.", "EPIST. Hildeg.", 1002, None],
    ["EPIST. Admont.", "EPIST. Adm.", 984, None],
    ["EPIST. Dominic.", "EPIST. Praed.", 1015, None],
    ["EPIST. Hildesh.", "EPIST. Hild.", 1001, None],
    ["EPIST. Visig.", "EPIST. Wisig.", 1028, None],
    ["EPIST. Wibald.", "EPIST. Wibald. I", 1026, None],
    ["EPITAPH. Thangm. Bernw.", "THANG. Bernw.", 1998, None],
    ["EPITAPH. Ermenr. Har.", "ERMENR. Har.", 1040, None],
    ["FORM. Salisb.", "FORM. Salisb. I", 1079, None],
    ["FROUM. (?) in Boeth.", "FROUM. carm.", 1104, None],
    ["FRUTOLF. (?) rhythmimach.", "FORTOLF. rhythmimach.", 1087, None],
    ["FUND. Werth.", "FUND. Werd.", 1119, None],
    ["GARS. tract.", "TRACT. Garsiae", 2045, None],
    ["GERB. epist. math. A", "GERB. epist. math. I", 1135, None],
    ["GERB. epist. math. B", "GERB. epist. math. II", 1136, None],
    ["GERB. opera math.", None, None, 6],
    ["GERH. crem. (?) sal. I", "PS. GERH. crem. sal. I", 1753, None],
    ["GERH. crem. (?) sal. II", "PS. GERH. crem. sal. II", 1754, None],
    ["GERH. crem. (?) sept.", "PS. GERH. crem. sept.", 1755, None],
    ["GERHOH. ad card.", "GERHOH. tract.", 1151, None],
    ["GERHOH. ord.", "GERHOH. tract.", 1151, None],
    ["GESTA Ern. duc.", "GESTA Ern. duc. II", 1176, None],
    ["GESTA Karoli M.", "FUND. Consecr. Petri", 1112, None],
    ["GLOSS. Index Steinmeyer", "\[GLOSS. ... St.-S.\]", 1207, None],
    ["GUIDO ARET. (?) tract. corr.", "\[PS. GUIDO ARET. tract. corr.\]", 1758, None],
    ["GUIDO CIST. antiph.", "ANON. mus. Guentner", 286, None],
    ["GUIDO CIST. mus.", "GUIDO augens. mus.", 1255, None],
    ["GRIMALD. epist.", "EPIST. var. II", 1022, None],
    ["HAIMO BAMB. comput.", "HEIMO BAMB. chron.", 1279, None],
    ["HERM. COL. conv.", "HERM. IUD. conv.", 1313, None],
    ["HROTSVITHAE opera", None, None, 6],
    ["HUCBALD. harm. inst.", "HUCBALD. mus.", 1405, None],
    ["IAMAT. chirurg.", "IOH. IAMAT. chirurg.", 1450, None],
    ["IDUNG. pruf.", None, None, 6],
    ["INSTR. Arn.", "CONC. Karol. A", 812, None],
    #["IOH. CANAP. ADALB.", "VITA Adalb. Prag. A (S. 3-47)/B (S. 51-67)/C (S. 71-84)"],
    ["IOH. PLATEAR. simpl. med.", "CIRCA INSTANS", 786, None],
    ["IOH. SARESB. pont.", None, None, 6],
    #["LAMB. PARV. ...", "LAMB. LEOD. ..."],
    ["LEG. Alam. A", "LEX Alam.", 1503, None],
    ["LEG. Alam. B", "LEX Alam.", 1503, None],
    #["LEG. Burgund.", "p. 29-116: LEG. Burgund. const. I; p. 117-122: LEG. Burgund. const. II; p. 123-163: LEG. Burgund. Rom."],
    ["LEG. Langob.", "LEG. Lang.", 1498, None],
    #["LEX. Sal. Karol. (Wortregister A-C)", "LEX. Sal. Karol."],
    #["LEX Sal. (100 Titel-Text, hrsg. von K. A. Eckhardt 1953, Wortregister D)", "LEX Sal. Pipp."],
    ["LIBELL. de Baw. et car.", "LIBELL. de conv. Baiuv.", 1518, None],
    ["Liber reddituum Sigbotonis III comitis (Mon. Boica)", "COD. Falk.", 791, None],
    ["LOTH. III. ad Innoc.", "EPIST. Bamb. 29", 988, None],
    ["LUDOW. IUN. ad Ludow.", "FORM. Sangall. II 27", 1081, None],
    ["MAGNUS annal.", "ANNAL. Reichersb.", 237, None],
    ["MANEG. (?) const.", "CONSUET. Marb.", 861, None],
    ["MARC. VALER. buc.", "MART. VALER. buc.", 1567, None],
    ["MEGINH. (?) Ferr.", "MEGINH. BLEID. Ferr.", 1582, None],
    #["MOSES. PANORM. equ.", "MOSES PANORM. infirm. (Seitenangabe beachten!)"],
    ["NIVARD. Ysengr.", "YSENGRIMUS", 2406, None],
    #["NOTAE Pruv.", "NOTAE Pruf."],
    ["ODILO Adelh.", "ODILO CLUN. Adelh.", 1630, None],
    ["ODO Ern. duc.", "ODO MAGDEB. Ern.", 1639, None],
    ["ORDO Illyr. (Pl. 138, 1328/B)", "ORDO Mind.", 1658, None],
    ["ORDO Rom.", "ORD. Rom.", 1657, None],
    ["ORDO Rom. ant.", "PONTIF. Rom.-Germ.", 1716, None],
    ["PAUL. AEGIN.", "PAUL. AEGIN. cur.", 1682, None],
    ["PAUL. AQUIL. carm.", "PAULIN. AQUIL. carm. I", 1694, None],
    ["PASS. Gereon.", "PASS. Ger. Col.", 2199, None],
    ["PETR. DAM. grat.", "PETR. DAM. epist.", 1703, None],
    ["PS. GALEN. febr.", "PS. GALEN. puls.", 1750, None],
    ["PS. ODO CLUN. prooem. ton.", "ODO ARET. ton. A", 1634, None],
    ["QUID SUUM VIRT.", "CARM. didasc.", 455, None],
    ["RATHER. itin.", "RATHER. epist.", 1815, None],
]

ie_addition_bla = [
    ["RATHER. serm.", "RATHER. quadrag. II"],
    ["RATHER. synod.", "\[RATHER. serm."],
    ["REGESTA alsatiae I", "CHART. Alsat. B"],
    ["REINH. epist.", "EPIST. Reinh."],
    ["RHYTHM. I", "RHYTHM."],
    ["RICH. revel.", "LIBER revel. Rich."],
    ["RICHARD. ANGL. correct.", "\[RICHARD. ANGL. correct.\]"],
    ["RUP. TUIT. spir.", "RUP. TUIT. trin."],
    ["SALOM. III. carm.", "SALOM. III. carm. I"],
    ["SERVITIA Col.", "LEX minist. Col. I (S. 4–10) / II (S. 59–62)"],
    ["STURM. consuet.", "ORD. Cas. I"],
    ["SYNOD. Alcuin. epist", "EPIST. Alcuin."],
    ["THANGM. (?) transl. Epiph.", "TRANSL. Epiph."],
    ["THEOD. TUIT. registr.", "THEOD. TUIT. registr. I (S. 270–277)/II (S. 278–291)"],
    ["THIETM. (?). prol.", "CHRON. Thietm."],
    ["TRACT. cod. Bamb.", "TRACT. de divis. phil."],
    ["TRACT. de mens. cruc.", "TRACT. de cruc. effig."],
    ["TRAD. Falk.", "COD. Falk."],
    ["TRAD. Neocell.", "TRAD. Neocell. Brixin."],
    ["TROTULA", "TROTULA A"],
    ["VITA Adelg. II", "Vita Aldeg. II 27 (AS Boll.3 Ian. III p. 655)"],
    ["VITA Cunib.", "VITA Cunib. B"],
    ["VITA Eber. (ZGeschOberrh…)", "Vita Eberh. Commed."],
    ["VITA Landel.", "VITA Landel. Laub."],
    ["VITA Magni Fauc.", "VITA Magni Fauc. I"],
    ["VITA Richard. Vird.", "VITA Richardi"],
    ["WALTH. SPIR. Christoph. I/II", "I (Prosa), II (Poesie)"],
    ["WIBALD. epist.", "WIBALD. epist. I"],
    ["WILH. MALM. pont.", None, None, 6],
    ["WOLFGER. Ellenbr.", "WOLFGER. itin. comput."],
    ["WOLFH. Hild. Godeh. I/II", "WOLFHER. Godeh. I/II"]
]

v_addition = [
    ["CHART. Thangm. Bernw.", "THANG. Bernw.", 1998],
]


class Archimedes(object):
    def __init__(self, db, dir_path):
        self.db = db
        self.dir_path = dir_path

    def convertZettel(self, zettelLimit):
        self.ocr_and_type(zettelLimit)
        self.setWork()

    def ocr_and_type(self, zettelLimit):
        loop_count = 0
        total_count = 0
        zettelLst = self.db.search("zettel", {"ocr_text": "NULL"}, ["id", "letter", "img_folder", "sibling"], limit=zettelLimit)
        if len(zettelLst) > 0:
            job_id = self.db.save("ocr_jobs", {"source": "ocr&Typ", "total": len(zettelLst), "count": 0})
            for zettel in zettelLst:
                loop_count += 1
                total_count += 1
                if zettel["img_folder"]!=None and (zettel["sibling"]==None or zettel["sibling"]==zettel["id"]):
                    if path.exists(self.dir_path+f"/zettel/{zettel['letter']}/{zettel['img_folder']}/{zettel['id']}.jpg"):
                        text = self._imgToText(self.dir_path+f"/zettel/{zettel['letter']}/{zettel['img_folder']}/{zettel['id']}.jpg")
                    else: text = ""
                else: text = ""
                self.db.save("zettel", {"ocr_text": text, "ocr_length": len(text)}, zettel["id"])
                if loop_count > 100:
                    loop_count = 0
                    self.db.save("ocr_jobs", {"count": total_count}, job_id)
            self._autoSetZettelType() # set zettel-type of I/E-zettel
            self.db.save("ocr_jobs", {"count": total_count, "finished": 1}, job_id)

    def _imgToText(self, filename):
        text = pytesseract.image_to_string(Image.open(filename).convert("L"))
        return text

    def _autoSetZettelType(self):
        zettelLst = self.db.command(f"SELECT id, type, ocr_text, ocr_length FROM zettel WHERE (type = 0 OR type IS NULL) AND ocr_text IS NOT NULL AND ocr_text !=''")
        zettelData = []
        if len(zettelLst)>0:
            for zettel in zettelLst:
                zettel["letter_length"] = len(re.findall("[a-z]", zettel["ocr_text"], re.IGNORECASE))
                zettel["word_length"] = len(re.findall("[a-z][a-z]+", zettel["ocr_text"], re.IGNORECASE))
                zettelData.append(zettel)
            data = pandas.DataFrame(zettelData)
            X = data[["ocr_length", "letter_length", "word_length"]]

            logisticRegr = load(f"{self.dir_path}/content/models/typeModel_2021_12_15.joblib")
            y = logisticRegr.predict(X)
            for nr, zettel in enumerate(zettelData):
                self.db.save("zettel", {"type": int(y[nr]), "auto": 1}, zettel["id"])

    def setWork(self):
        # get zettel
        zettelLst = self.db.command('SELECT id, type, ocr_text, work_id, ac_web FROM zettel WHERE auto != 2 AND letter = "T" AND ocr_text IS NOT NULL AND ocr_text != "" and (type = 1 OR type = 2 OR type = 3 OR type = 6) AND work_id IS NULL')
        print("all zettel with ocr:", len(zettelLst))
        if len(zettelLst) > 0:
            loop_count = 0
            total_count = 0
            job_id = self.db.save("ocr_jobs", {"source": "Werk", "total": len(zettelLst), "count": 0})
            logisticRegr = load(f"{self.dir_path}/content/models/workModel_2022_02_15.joblib")
            # load data: work and addition - reverse sorting
            works_ie = self.db.command('SELECT id, ac_web FROM work WHERE is_verzettelt IS NULL')
            works_v = self.db.command('SELECT id, ac_web FROM work WHERE is_verzettelt = 1')
            def sortWorks(item): return item["ac_web"]
            def sortAddition(item): return item[0]
            works_ie.sort(key=sortWorks, reverse=True)
            works_v.sort(key=sortWorks, reverse=True)
            ie_addition.sort(key=sortAddition, reverse=True)

            def sort_results(item): return item[1]
            workResults = []
            # loop through unset zettel and try to find work
            for checkWork in zettelLst:
                loop_count += 1
                total_count += 1
                found_word = None
                if checkWork["type"] == 1: # verzettelt!
                    max_range = 3
                    result_lst = []
                    for work in works_v:
                        matches = find_near_matches(work["ac_web"], checkWork["ocr_text"], max_l_dist=max_range)
                        if len(matches)>0:
                            result_lst.append([work["id"], matches[0].dist])
                            if matches[0].dist == 0: break
                    if len(result_lst) == 0: # only check additional data if nothing else is found.
                        for add in v_addition:
                                matches = find_near_matches(add[0], checkWork["ocr_text"], max_l_dist=max_range)
                                if len(matches)>0:
                                    result_lst.append([add[2], matches[0].dist])
                                    if matches[0].dist == 0: break
                    if len(result_lst) > 0:
                        result_lst.sort(key=sort_results)
                        found_word = result_lst[0][0]
                        checkWork["distance"] = result_lst[0][1]
                else: # index/exzerpt!
                    result_lst = []
                    for work in works_ie:
                        max_range = 2
                        if len(work["ac_web"]) < 6: max_range = 1
                        if work["ac_web"] == "ALBERT. M. anim.": max_range = 0
                        matches = find_near_matches(work["ac_web"], checkWork["ocr_text"], max_l_dist=max_range)
                        if len(matches)>0:
                            result_lst.append([work["id"], matches[0].dist])
                            if matches[0].dist == 0: break
                    if len(result_lst) == 0: # only check additional data if nothing else is found!
                        max_range = 2
                        for add in ie_addition:
                                matches = find_near_matches(add[0], checkWork["ocr_text"], max_l_dist=max_range)
                                if len(matches)>0:
                                    result_lst.append([add[2], matches[0].dist])
                                    if matches[0].dist == 0: break
                    if len(result_lst) > 0:
                        result_lst.sort(key=sort_results)
                        found_word = result_lst[0][0]
                        checkWork["distance"] = result_lst[0][1]
                # saving results
                if found_word:
                    if logisticRegr.predict([[found_word, checkWork["type"], checkWork["distance"]]]) == 1:
                        self.db.save("zettel", {"work_id": found_word,"auto": 2}, checkWork["id"])
                        print("correct hit")
                    else:
                        self.db.save("zettel", {"auto": 2}, checkWork["id"])
                        print("DO NOT SAVE!")
                else:
                    self.db.save("zettel", {"auto": 2}, checkWork["id"])
                    print("Not found.")
                if loop_count > 100:
                    loop_count = 0
                    self.db.save("ocr_jobs", {"count": total_count}, job_id)
            self.db.save("ocr_jobs", {"count": total_count, "finished": 1}, job_id)
        print("work set!")