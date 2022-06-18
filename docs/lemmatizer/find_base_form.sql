
CREATE OR REPLACE INDEX dicts_index ON forms (dict_id);
UPDATE dicts SET base_form = NULL;
UPDATE dicts SET base_form = (
	SELECT f.form FROM forms f WHERE dicts.id=f.dict_id AND f.part="ADV" AND stem_key=1
)
WHERE part="ADV" AND stem_1!="zzz";

UPDATE dicts SET base_form = (
	SELECT f.form FROM forms f WHERE dicts.id=f.dict_id AND f.part="ADV" AND stem_key=2
)
WHERE part="ADV" AND base_form IS NULL;

UPDATE dicts SET base_form = (
	SELECT f.form FROM forms f WHERE dicts.id=f.dict_id
)
WHERE part in ("CONJ", "INTERJ", "PREP");

UPDATE dicts SET base_form = (
	SELECT f.form FROM forms f WHERE dicts.id=f.dict_id AND f.part="ADJ" AND f.case_type = "NOM" AND f.number="S" AND (f.gender = "M" OR f.gender="C" OR f.gender="X") AND (f.stem_key=0 OR f.stem_key=1)
)
WHERE part="ADJ" AND stem_1!="zzz" AND stem_1 !="X";


/*




()
(f.part="N" AND f.case_type = "NOM" AND f.number="S")
(f.part="PRON" AND f.case_type = "NOM" AND f.number="S" AND f.gender = "M")
(f.part="V" AND )
| V      |

| NUM    |
| PACK   |


+--------+
*/