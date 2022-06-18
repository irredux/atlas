

-- PRON
-- NUM
-- V

/*
INSERT INTO
    forms (form, part, kind, age, freq, uses_case, stem_id, ending_id, con, var, case_type, number, gender, num_val, tense, voice, mood, person, dict_id, stem_key)
    SELECT
        REPLACE(REPLACE(LOWER(CONCAT(stems.stem,endings.ending)), "j", "i"), "v", "u"),
        stems.part,
        IF(stems.kind="" OR stems.kind="X" OR stems.kind=endings.kind,endings.kind,stems.kind),
        endings.age,
        endings.freq,
        stems.uses_case,
        stems.id,
        endings.id,
        stems.con,
        stems.var,
        endings.case_type,
        endings.number,
        IF(stems.gender=endings.gender OR (stems.gender="X" AND endings.gender="C") OR (stems.gender="C" AND endings.gender IN ("M","F")) OR stems.part IN ("NUM", "ADV", "INTERJ", "CONJ", "PREP", "PRON", "ADJ", "V"),endings.gender, stems.gender),
        stems.num_val,
        endings.tense,
        endings.voice,
        endings.mood,
        endings.person,
        stems.dict_id,
        stems.stem_key
    FROM stems
    LEFT JOIN endings ON (
        ((stems.stem_key>0 AND endings.stem_key = stems.stem_key) OR (stems.stem_key=0 AND (endings.stem_key=1 OR endings.stem_key=2))) AND
        endings.part = stems.part AND
        (
            (stems.part="NUM" AND ((stems.kind="X" AND (endings.kind="ADVERB" OR endings.kind="CARD" OR endings.kind="DIST" OR endings.kind="ORD")) OR (stems.kind=endings.kind)) AND (endings.con=0 OR endings.con=stems.con) AND (endings.var=0 OR endings.var=stems.var)) OR
            (stems.part="V" AND (endings.con=0 OR endings.con=stems.con) AND (endings.var=0 OR endings.var=stems.var) AND endings.part IN ("V", "VPAR", "SUPINE")) OR
            (stems.part IN ("PRON") AND (endings.con=0 OR endings.con=stems.con) AND (endings.var=0 OR endings.var=stems.var)) OR
        )
    )
;*/


CREATE OR REPLACE INDEX form_index ON forms (form);