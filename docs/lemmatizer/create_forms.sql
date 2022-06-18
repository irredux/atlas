CREATE OR REPLACE TABLE forms (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    form VARCHAR(100),
    part VARCHAR(10), # wortart
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
    comparison VARCHAR(5), # POS, COMP, SUPER
    #age VARCHAR(1),
    #freq VARCHAR(1),
    stem_id INTEGER,
    ending_id INTEGER,
    dict_id INTEGER#,
    #stem_key INTEGER
);

INSERT INTO forms (dict_id, form, part, uses_case)
    SELECT id, stem_1, part, uses_case FROM dicts WHERE part IN ("CONJ", "INTERJ", "PREP");


-- ADV
INSERT INTO forms (dict_id, form, part, comparison)
    SELECT id, stem_1, "ADV", "POS" FROM dicts WHERE part = "ADV" AND stem_1 != "zzz";
INSERT INTO forms (dict_id, form, part, comparison)
    SELECT id, stem_2, "ADV", "COMP" FROM dicts WHERE part = "ADV" AND stem_2 != "" AND stem_2 != "zzz";
INSERT INTO forms (dict_id, form, part, comparison)
    SELECT id, stem_3, "ADV", "SUPER" FROM dicts WHERE part = "ADV" AND stem_3 != "" AND stem_3 != "zzz";

-- ADJ
/*
con = 0, 1, 2, 3, 9
var =    0, 1, 2, 3, 4, 5, 6, 7, 8, 9

*/
-- N

# | ADV    |  stem_1 = pos; stem_2 = comp.; stem_3 = super + no ending // stem_1 and stem_2 can be "zzz"




# | N      | 

# | ADJ    |

# | NUM    |
# | PACK   |

# | PRON   |
# | V      |

# create forms from stems end endings