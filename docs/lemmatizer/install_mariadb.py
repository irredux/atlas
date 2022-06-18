import sys
dict_txt = ""
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

        # save new lemma
        if con == "": con = "NULL"
        if var == "": var = "NULL"
        dict_txt += f'INSERT INTO dicts (stem_1, stem_2, stem_3, stem_4, part, con, var, kind, gender, num_val, uses_case, age, area, geo, freq, source, meaning)\n    VALUES ("{stem_1}","{stem_2}","{stem_3}","{stem_4}","{part}",{con},{var},"{kind}","{gender}",{num_val},"{uses_case}","{age}","{area}","{geo}","{freq}","{source}","{meaning}");\n'


dict_txt = """
CREATE OR REPLACE TABLE dicts (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    age VARCHAR(1),
    stem_1 VARCHAR(20),
    stem_2 VARCHAR(20),
    stem_3 VARCHAR(20),
    stem_4 VARCHAR(20),
    part VARCHAR(10),
    con INTEGER,
    var INTEGER,
    kind VARCHAR(10),
    gender VARCHAR(1),
    num_val INTEGER,
    uses_case VARCHAR(10),
    area VARCHAR(1),
    geo VARCHAR(1),
    freq VARCHAR(1),
    source VARCHAR(1),
    base_form VARCHAR(200),
    meaning VARCHAR(200))
;
"""+ dict_txt +"""
-- DELETE FROM dicts WHERE id IN (38189);
DELIMITER //
CREATE OR REPLACE PROCEDURE create_stems ()
DETERMINISTIC
BEGIN

    CREATE OR REPLACE TABLE stems (
        id INTEGER AUTO_INCREMENT PRIMARY KEY,
        stem VARCHAR(20),
        part VARCHAR(10),
        con INTEGER,
        var INTEGER,
        gender VARCHAR(1),
        kind VARCHAR(10),
        uses_case VARCHAR(10),
        num_val INTEGER,
        stem_key INTEGER,
        dict_id INTEGER
    );
            
    INSERT INTO
            stems (stem,part,con,var,gender,kind,uses_case,num_val,stem_key,dict_id)
        SELECT
            stem_1,part,con,var,gender,kind,uses_case,num_val,0,id
        FROM dicts
        WHERE stem_1 = stem_2 AND stem_1 != "zzz"
    ;

    INSERT INTO
            stems (stem,part,con,var,gender,kind,uses_case,num_val,stem_key,dict_id)
        SELECT
            stem_1,part,con,var,gender,kind,uses_case,num_val,1,id
        FROM dicts
        WHERE stem_1 != stem_2 AND stem_1 != "zzz"
    ;

    INSERT INTO
            stems (stem,part,con,var,gender,kind,uses_case,num_val,stem_key,dict_id)
        SELECT
            stem_2,part,con,var,gender,kind,uses_case,num_val,2,id
        FROM dicts
        WHERE stem_1 != stem_2 AND stem_2 != "" AND stem_2 != "zzz"
    ;

    INSERT INTO
            stems (stem,part,con,var,gender,kind,uses_case,num_val,stem_key,dict_id)
        SELECT
            stem_3,part,con,var,gender,kind,uses_case,num_val,3,id
        FROM dicts
        WHERE stem_3 != "" AND stem_3 != "zzz"
    ;

    INSERT INTO
            stems (stem,part,con,var,gender,kind,uses_case,num_val,stem_key,dict_id)
        SELECT
            stem_4,part,con,var,gender,kind,uses_case,num_val,4,id
        FROM dicts
        WHERE stem_4 != "" AND stem_4 != "zzz"
    ;
END; //
DELIMITER ;
CALL create_stems();
"""
open("dictline.sql", "w").write(dict_txt)


inflect_txt = ""
with open("data/INFLECTS.LAT", "r", encoding="utf-8") as inflect_file:
    for row in inflect_file.readlines():
        row = row[:-1]
        if row.find("--") > -1: row = row[:row.find("--")]
        row = row.strip()
        if row != "":
            row = row.split()
            if row[0] == "NUM": # dicts.part = NUM
                # part, con, var, case_type, number, gender, kind, stem_key, length_of_ending, ending, age, freq
                if len(row) == 12:
                    inflect_txt += f'INSERT INTO endings (part, con, var, case_type, number, gender, kind, stem_key, ending, age, freq) VALUES ("{row[0]}", {row[1]}, {row[2]}, "{row[3]}", "{row[4]}", "{row[5]}", "{row[6]}", {row[7]}, "{row[-3]}", "{row[-2]}", "{row[-1]}");\n' # 
                elif len(row) == 11 and int(row[8]) == 0:
                    inflect_txt += f'INSERT INTO endings (part, con, var, case_type, number, gender, kind, stem_key, ending, age, freq) VALUES ("{row[0]}", {row[1]}, {row[2]}, "{row[3]}", "{row[4]}", "{row[5]}", "{row[6]}", {row[7]}, "", "{row[-2]}", "{row[-1]}");\n'
                else: raise ValueError("cannot parse line!")
            elif row[0] == "PRON": # dicts.part = PRON
                if len(row) == 11:
                    inflect_txt += f'INSERT INTO endings (part, con, var, case_type, number, gender, stem_key, ending, age, freq) VALUES ("{row[0]}", {row[1]}, {row[2]}, "{row[3]}", "{row[4]}", "{row[5]}", {row[6]}, "{row[-3]}", "{row[-2]}", "{row[-1]}");\n'
                elif len(row) == 10 and int(row[-3]) == 0:
                    inflect_txt += f'INSERT INTO endings (part, con, var, case_type, number, gender, stem_key, ending, age, freq) VALUES ("{row[0]}", {row[1]}, {row[2]}, "{row[3]}", "{row[4]}", "{row[5]}", {row[6]}, "", "{row[-2]}", "{row[-1]}");\n'
                else: raise ValueError("cannot parse line!")
            elif row[0] == "SUPINE": # %s%s%s%s
                if len(row) == 11:
                    inflect_txt += f'INSERT INTO endings (part, con, var, case_type, number, gender, stem_key, ending, age, freq) VALUES ("{row[0]}", {row[1]}, {row[2]}, "{row[3]}", "{row[4]}", "{row[5]}", {row[6]}, "{row[-3]}", "{row[-2]}", "{row[-1]}");\n'
                else: raise ValueError("cannot parse line!")
            elif row[0] == "VPAR":
                if len(row) == 14:
                    inflect_txt += f'INSERT INTO endings (part, con, var, case_type, number, gender, tense, voice, mood, stem_key, ending, age, freq) VALUES ("{row[0]}", {row[1]}, {row[2]}, "{row[3]}", "{row[4]}", "{row[5]}", "{row[6]}", "{row[7]}", "{row[8]}", {row[9]}, "{row[-3]}", "{row[-2]}", "{row[-1]}");\n'
                else: raise ValueError("cannot parse line!")
            elif row[0] == "V": # dicts.part = V
                if len(row) == 13:
                    inflect_txt += f'INSERT INTO endings (part, con, var, tense, voice, mood, person, number, stem_key, ending, age, freq) VALUES ("{row[0]}", {row[1]}, {row[2]}, "{row[3]}", "{row[4]}", "{row[5]}", {row[6]}, "{row[7]}", {row[8]}, "{row[-3]}", "{row[-2]}", "{row[-1]}");\n'
                elif len(row) == 12 and int(row[9]) == 0:
                    inflect_txt += f'INSERT INTO endings (part, con, var, tense, voice, mood, person, number, stem_key, ending, age, freq) VALUES ("{row[0]}", {row[1]}, {row[2]}, "{row[3]}", "{row[4]}", "{row[5]}", {row[6]}, "{row[7]}", {row[8]}, "", "{row[-2]}", "{row[-1]}");\n'
                else: raise ValueError("cannot parse line!")
            elif row[0] == "ADJ": # dicts.part = ADJ
                #part, con, var, case_type, number, gender, kind, stem_key, length_of_ending, ending, age, freq
                if len(row) == 12:
                    inflect_txt += f'INSERT INTO endings (part, con, var, case_type, number, gender, kind, stem_key, ending, age, freq) VALUES ("{row[0]}", {row[1]}, {row[2]}, "{row[3]}", "{row[4]}", "{row[5]}", "{row[6]}", {row[7]}, "{row[-3]}", "{row[-2]}", "{row[-1]}");\n'
                elif len(row) == 11 and int(row[-3]) == 0:
                    inflect_txt += f'INSERT INTO endings (part, con, var, case_type, number, gender, kind, stem_key, ending, age, freq) VALUES ("{row[0]}", {row[1]}, {row[2]}, "{row[3]}", "{row[4]}", "{row[5]}", "{row[6]}", {row[7]}, "", "{row[-2]}", "{row[-1]}");\n'
                else: raise ValueError("cannot parse line!")
            elif row[0] == "N": # dicts.part = N
                if len(row) != 11 and int(row[7]) == 0: # without ending
                    inflect_txt += f'INSERT INTO endings (part, con, var, case_type, number, gender, stem_key, ending, age, freq) VALUES ("{row[0]}", {row[1]}, {row[2]}, "{row[3]}", "{row[4]}", "{row[5]}", {row[6]}, "", "{row[-2]}", "{row[-1]}");\n'
                elif len(row) == 11: # with ending
                    inflect_txt += f'INSERT INTO endings (part, con, var, case_type, number, gender, stem_key, ending, age, freq) VALUES ("{row[0]}", {row[1]}, {row[2]}, "{row[3]}", "{row[4]}", "{row[5]}", {row[6]}, "{row[8]}", "{row[-2]}", "{row[-1]}");\n'
                else:
                    raise ValueError("cannot parse line!")
            elif row[0] in ["CONJ", "INTERJ"]: # dicts.part = INTERJ or dicts.part == CONJ
                inflect_txt += f'INSERT INTO endings (part, stem_key, ending, age, freq) VALUES ("{row[0]}", {row[1]}, "", "{row[-2]}", "{row[-1]}");\n' # [row[0], row[1], "", row[-2], row[-1]])
            elif row[0] == "PREP": # dicts.part = PREP
                inflect_txt += f'INSERT INTO endings (part, uses_case, stem_key, ending, age, freq) VALUES ("{row[0]}", "{row[1]}", {row[2]}, "", "{row[-2]}", "{row[-1]}");\n' # [row[0], row[1], row[2], "", row[-2], row[-1]])
            elif row[0] == "ADV": # dicts.part = ADV
                inflect_txt += f'INSERT INTO endings (part, kind, stem_key, ending, age, freq) VALUES ("{row[0]}", "{row[1]}", {row[2]}, "", "{row[-2]}", "{row[-1]}");\n' # [row[0], row[1], row[2], "", row[-2], row[-1]])
inflect_txt = """
CREATE OR REPLACE TABLE endings (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    part VARCHAR(10),
    con INTEGER,
    var INTEGER,
    tense VARCHAR(10),
    voice VARCHAR(10),
    mood VARCHAR(10),
    person VARCHAR(10),
    case_type VARCHAR(10),
    number VARCHAR(10),
    gender VARCHAR(10),
    uses_case VARCHAR(10),
    kind VARCHAR(10),
    stem_key INTEGER,
    ending VARCHAR(10),
    age VARCHAR(1),
    freq VARCHAR(1))
;
"""+inflect_txt+"""
CREATE OR REPLACE TABLE forms (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    form VARCHAR(100),
    part VARCHAR(10),
    con INTEGER,
    var INTEGER,
    kind VARCHAR(10),
    case_type VARCHAR(10),
    number VARCHAR(10),
    tense VARCHAR(10),
    voice VARCHAR(10),
    mood VARCHAR(10),
    person VARCHAR(10),
    gender VARCHAR(10),
    uses_case VARCHAR(3),
    num_val INTEGER,
    age VARCHAR(1),
    freq VARCHAR(1),
    stem_id INTEGER,
    ending_id INTEGER,
    dict_id INTEGER,
    stem_key INTEGER
);

INSERT INTO
    forms (form, part, kind, age, freq, uses_case, stem_id, ending_id, con, var, case_type, number, gender, num_val, tense, voice, mood, person, dict_id, stem_key)
    SELECT
        REPLACE(REPLACE(LOWER(CONCAT(stems.stem,endings.ending)), "j", "i"), "v", "u"),
        stems.part,
        stems.kind,
        endings.age,
        endings.freq,
        stems.uses_case,
        stems.id,
        endings.id,
        stems.con,
        stems.var,
        endings.case_type,
        endings.number,
        endings.gender,
        stems.num_val,
        endings.tense,
        endings.voice,
        endings.mood,
        endings.person,
        stems.dict_id,
        stems.stem_key
    FROM stems
    LEFT JOIN endings ON (endings.part = stems.part AND endings.stem_key = stems.stem_key AND stems.kind=endings.kind AND endings.uses_case=stems.uses_case)
    WHERE stems.part IN ("CONJ", "INTERJ", "ADV", "PREP")
;
INSERT INTO
    forms (form, part, kind, age, freq, uses_case, stem_id, ending_id, con, var, case_type, number, gender, num_val, tense, voice, mood, person, dict_id, stem_key)
    SELECT
        REPLACE(REPLACE(LOWER(CONCAT(stems.stem,endings.ending)), "j", "i"), "v", "u"),
        stems.part,
        stems.kind,
        endings.age,
        endings.freq,
        stems.uses_case,
        stems.id,
        endings.id,
        stems.con,
        stems.var,
        endings.case_type,
        endings.number,
        IF(stems.gender="X" OR stems.gender="C",endings.gender, stems.gender),
        stems.num_val,
        endings.tense,
        endings.voice,
        endings.mood,
        endings.person,
        stems.dict_id,
        stems.stem_key
    FROM stems
    LEFT JOIN endings ON (endings.part = stems.part AND
        (endings.stem_key = stems.stem_key OR (stems.stem_key=0 AND (endings.stem_key=1 OR endings.stem_key=2))) AND
        (endings.con=0 OR endings.con=stems.con) AND
        (endings.var=0 OR endings.var=stems.var) AND
        (
            (stems.gender="M" AND (endings.gender="M" OR endings.gender="C" OR endings.gender="X")) OR
            (stems.gender="F" AND (endings.gender="F" OR endings.gender="C" OR endings.gender="X")) OR
            (stems.gender="N" AND (endings.gender="N" OR endings.gender="X")) OR
            (stems.gender="C" AND (endings.gender="M" OR endings.gender="F" OR endings.gender="C" OR endings.gender="X")) OR
            (stems.gender="X" AND (endings.gender="M" OR endings.gender="F" OR endings.gender="N" OR endings.gender="C" OR endings.gender="X"))
        )
    )
    WHERE stems.part = "N"
;
INSERT INTO
    forms (form, part, kind, age, freq, uses_case, stem_id, ending_id, con, var, case_type, number, gender, num_val, tense, voice, mood, person, dict_id, stem_key)
    SELECT
        REPLACE(REPLACE(LOWER(CONCAT(stems.stem,endings.ending)), "j", "i"), "v", "u"),
        stems.part,
        IF(stems.kind="X",endings.kind,stems.kind),
        endings.age,
        endings.freq,
        stems.uses_case,
        stems.id,
        endings.id,
        stems.con,
        stems.var,
        endings.case_type,
        endings.number,
        endings.gender,
        stems.num_val,
        endings.tense,
        endings.voice,
        endings.mood,
        endings.person,
        stems.dict_id,
        stems.stem_key
    FROM stems
    LEFT JOIN endings ON (endings.part = stems.part AND
        endings.stem_key = stems.stem_key AND
        (endings.con=0 OR endings.con=stems.con) AND
        (endings.var=0 OR endings.var=stems.var) AND
        (stems.kind="X" OR stems.kind=endings.kind) # is this true? or should it be stems.kind=endings.kind in every situation?
    )
    WHERE stems.part = "ADJ"
;
"""


open("inflects.sql", "w").write(inflect_txt)