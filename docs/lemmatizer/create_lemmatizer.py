#import sys
#dict_txt = ""
masterlst = []
with open("data/DICTLINE.txt", "r", encoding="utf-8") as stem_file:
    for row in stem_file.readlines():
        stem_1 = row[:19].strip()
        stem_2 = row[19:38].strip()
        stem_3 = row[38:57].strip()
        stem_4 = row[57:76].strip()
        part = row[76:83].strip() # wortart
        con = ""
        var = ""
        kind = ""
        gender = ""
        num_val = "NULL"
        uses_case = ""
        age = row[100:102].strip()
        area = row[102:104].strip()
        geo = row[104:106].strip()
        freq = row[106:108].strip()
        source = row[108:110].strip()
        meaning = row[110:].strip()
        if part == "N":
            con = row[83:85].strip() # haupt-typ der conion (entspricht Endungen)
            var = row[85:87].strip() # sub-typ der conion (entspricht Endungen)
            gender = row[87:89].strip()
            kind = row[89:100].strip()
        elif part == "ADV":
            kind = row[83:100].strip()
        elif part == "NUM":
            con = row[83:85].strip()
            var = row[85:87].strip()
            kind = row[87:95].strip()
            num_val = row[95:100].strip()
        elif part == "PREP":
            uses_case = row[83:100].strip()
        else:
            con = row[83:85].strip() # haupt-typ der conion (entspricht Endungen)
            var = row[85:87].strip() # sub-typ der conion (entspricht Endungen)
            kind = row[87:100].strip() # verb_kind, adj_kind usw.
        masterlst.append({
            "id": len(masterlst),
            "stem_1": stem_1 if stem_1!="zzz" else "",
            "stem_2": stem_2 if stem_2!="zzz" else "",
            "stem_3": stem_3 if stem_3!="zzz" else "",
            "stem_4": stem_4 if stem_4!="zzz" else "",
            "part": part,
            "kind": kind,
            "con": con,
            "var": var,
            "gender": gender,
            "num_val": num_val,
            "uses_case": uses_case,
        })

formlst = []
for e in masterlst:
    if e["part"] in ["CONJ", "INTERJ"]:
        formlst.append({
            "form": e["stem_1"],
            "part": e["part"],
            "master_id": e["id"]
        })
    elif e["part"] == "PREP":
        formlst.append({
            "form": e["stem_1"],
            "part": "PREP",
            "case": e["uses_case"],
            "master_id": e["id"]
        })
    elif e["part"] == "ADV":
        if stem_1 != "":
            formlst.append({
                "form": e["stem_1"],
                "part": "ADV",
                "comparison": "POS" if e["kind"] == "X" else e["kind"],
                "master_id": e["id"]
            })
        if stem_2 != "":
            formlst.append({
                "form": e["stem_2"],
                "part": "ADV",
                "comparison": "COMP",
                "master_id": e["id"]
            })
        if stem_3 != "":
            formlst.append({
                "form": e["stem_3"],
                "part": "ADV",
                "comparison": "SUPER",
                "master_id": e["id"]
            })


print("master entries:", len(masterlst))
print("form entries:", len(formlst))

#variant = ""
#word = ""
#word_display = ""
#if part in ["CONJ", "INTERJ", "ADV"]:
#    word = stem_1 if stem_1 != "zzz" else stem_2
#    word_display = stem_1 if stem_1 != "zzz" else stem_2
#elif part == "ADJ" and con == "1":
#    word = f"{stem_1}us"
#    word_display = f"{stem_1}us, -a, -um"
#elif part == "ADJ" and con == "2": # declension from the Greek 
#    word = f"{stem_1}os"
#    word_display = f"{stem_1}os, -on"
#elif part == "ADJ" and con == "3": # 3 decl.
#    word = f"{stem_1}"
#    if var == "1":
#        word_display = f"{stem_1}"
#    elif var == "2":
#        word_display = f"{stem_1}is, -e"
#    elif var == "3":
#        word_display = f"{stem_1}, -is, -e"
#    else:
#        word_dipslay = f"?????" # 6 = greek declination?
#dict_txt = """
#CREATE OR REPLACE TABLE master_word_lst (
#    id INTEGER AUTO_INCREMENT PRIMARY KEY,
#    stem_1 VARCHAR(20),
#    stem_2 VARCHAR(20),
#    stem_3 VARCHAR(20),
#    stem_4 VARCHAR(20),
#    part VARCHAR(10),
#    variant VARCHAR(20), # i.e. 1/2.dekl, 3. dekl etc.
#    gender VARCHAR(1),
#    num_val INTEGER,
#    uses_case VARCHAR(10),
#    word VARCHAR(200),
#    word_display VARCHAR(200)
#)
#;
#"""+ dict_txt
#open("create_lemmatizer.sql", "w").write(dict_txt)