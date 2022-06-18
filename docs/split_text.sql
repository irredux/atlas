DELIMITER // -- version 2.0
CREATE OR REPLACE PROCEDURE SPLITTEXT ( IN current_id INT )
DETERMINISTIC
BEGIN
    DECLARE current_text TEXT;
    DECLARE new_text TEXT DEFAULT "";
    DECLARE startWord INT DEFAULT 0;
    DECLARE endWord INT DEFAULT 0;
    DECLARE preWord VARCHAR(100);
    DECLARE word TEXT;
    DECLARE postWord VARCHAR(100);
    DECLARE countWords INT DEFAULT 0;
    DECLARE scan_path VARCHAR(400);

    -- DELETE FROM txt WHERE scan_id = current_id;
    SELECT IF(full_text IS NOT NULL, full_text, ocr_auto), path FROM scan WHERE id = current_id INTO current_text, scan_path;
    SET current_text = REPLACE(current_text, " ", "\n");
    SET current_text = REGEXP_REPLACE(current_text, "([a-z])-\n([a-z])", "\\1\\2");
    SET current_text = REPLACE(current_text, "\n", "\n ");
    SET current_text = REPLACE(current_text, "æ", "ae");
    SET current_text = CONCAT(current_text, " ");

    SET endWord = LOCATE(" ", current_text);
    WHILE endWord > 0 DO
        SET countWords = countWords + 1;
        -- get next word in text
        SET word = SUBSTRING(current_text, startWord+1, endWord-startWord-1);
        SET preWord = "";
        SET postWord = "";

        -- separate punctuation
        WHILE word REGEXP "^[().?!,:;'’‘„“«»*\n]" DO
            SET preWord = CONCAT(preWord, LEFT(word,1));
            SET word =  REGEXP_REPLACE(word, "^[().?!,:;'’‘„“«»*\n]", "");
        END WHILE;
        WHILE word REGEXP "[().?!,:;'’‘„“«»*\n]$" DO
            SET postWord = CONCAT(RIGHT(word,1), postWord);
            SET word =  REGEXP_REPLACE(word, "[().?!,:;'’‘„“«»*\n]$", "");
        END WHILE;

        -- save word
        INSERT INTO txt (pre, word, word_plain, post, scan_path, scan_id) VALUES (IF(preWord = "", NULL, preWord), word, REGEXP_REPLACE(REGEXP_REPLACE(LOWER(word), "j", "i"), "v", "u"), IF(postWord = "", NULL, postWord), scan_path, current_id);

        -- search for new word
        SET startWord = endWord;
        SET endWord = endWord + 1;
        SET endWord = LOCATE(" ", current_text, endWord);
    END WHILE;
END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE PROCEDURE updateTxt ()
DETERMINISTIC
BEGIN
    DECLARE current_id INT DEFAULT 0;
    DECLARE lastId INT DEFAULT 0;
    DECLARE loop_count INT DEFAULT 0;

    -- (re)calculate txt table 
    CREATE OR REPLACE TABLE txt (id INT PRIMARY KEY AUTO_INCREMENT, pre TEXT, word TEXT COLLATE utf8mb4_unicode_ci, word_plain TEXT COLLATE utf8mb4_unicode_ci, post TEXT, needles TEXT, scan_path VARCHAR(400), scan_id INT);

    SELECT id FROM scan WHERE (full_text IS NOT NULL OR ocr_auto IS NOT NULL) AND id > current_id LIMIT 1 INTO current_id;
    WHILE current_id IS NOT NULL DO
        SET loop_count = loop_count + 1;
        CALL SPLITTEXT(current_id);
        SET lastId = current_id;
        SET current_id = NULL;
        SELECT id FROM scan WHERE (full_text IS NOT NULL OR ocr_auto IS NOT NULL) AND id > lastId LIMIT 1 INTO current_id;
        SELECT loop_count;
    END WHILE;
    CREATE OR REPLACE INDEX txt_index ON txt(word);

    -- updat needles
    -- UPDATE txt SET needles = (SELECT id FROM needles WHERE needle = REGEXP_REPLACE(REGEXP_REPLACE(word, "j", "i"), "v", "u")) WHERE needles IS NULL;

    -- SELECT CONCAT((SELECT COUNT(*) FROM txt WHERE needles IS NULL), " (", 100/(SELECT COUNT(*) FROM txt)*(SELECT COUNT(*) FROM txt WHERE needles IS NULL), "%)") AS "words not found";
END; //
DELIMITER ;

CALL updateTxt();