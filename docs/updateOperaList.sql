DELIMITER //
CREATE OR REPLACE PROCEDURE updateOperaLists ()
BEGIN
/* maiora list */
    /* 1. insert works on separat line */
    CREATE OR REPLACE TABLE opera_maiora_temp (id INT PRIMARY KEY AUTO_INCREMENT, author_id INT, work_id INT, date_display VARCHAR(200), abbr VARCHAR(200), full TEXT, search VARCHAR(300), bibliography TEXT, comment TEXT, editions_id JSON, editions_url JSON, editions_label JSON, author_sort VARCHAR(200), work_sort VARCHAR(200), gq_author_id INT, gq_work_id INT, same_line BOOL);
    INSERT INTO opera_maiora_temp
    (work_id, date_display, abbr, full, bibliography, comment, author_sort, work_sort, search, gq_work_id, gq_author_id)
        SELECT
            work.id,
            work.date_display,
            IF(
                work.author_display IS NOT NULL AND work.author_display != "",
                IF(work.in_use != 1, CONCAT('[<aut>', work.author_display, '</aut> ', work.abbr,']'), CONCAT('<aut>',work.author_display,'</aut> ', work.abbr)),
                IF(work.in_use != 1, CONCAT('[', work.abbr, ']'), work.abbr)
            ),
            CONCAT(
                IF(work.full IS NOT NULL, work.full, ""),
                IF(work.reference IS NOT NULL AND work.reference!="", CONCAT(" v. ", work.reference), "")
            ),
            work.bibliography,
            CONCAT(
                IF(work.citation IS NOT NULL, work.citation, ""),
                " ",
                IF(work.txt_info IS NOT NULL, work.txt_info, "")
            ),
            author.abbr_sort,
            work.abbr_sort,
            work.ac_web,
            work.gq_id,
            author.gq_id
        FROM work
        LEFT JOIN author ON author.id = work.author_id
        WHERE is_maior = 1 AND work.abbr IS NOT NULL
    ;

    /* 2. insert works+authors an same line */
    INSERT INTO opera_maiora_temp
    (author_id, work_id, date_display, abbr, full, bibliography, comment, author_sort, work_sort, search, gq_work_id, gq_author_id, same_line)
        SELECT
            author.id,
            work.id,
            work.date_display,
            IF(
                author.in_use != 1,
                CONCAT('[', author.abbr, ']'),
                author.abbr
            ),
            CONCAT(
                IF(author.full IS NOT NULL, author.full, ""),
                IF(work.reference IS NOT NULL AND work.reference != "", CONCAT(" v. ", work.reference),"")
            ),
            work.bibliography,
            CONCAT(
                IF(work.citation IS NOT NULL, work.citation, ""),
                " ",
                IF(work.txt_info IS NOT NULL, work.txt_info, "")
            ),
            author.abbr_sort,
            work.abbr_sort,
            work.ac_web,
            work.gq_id,
            author.gq_id,
            1
        FROM work
        LEFT JOIN author ON author.id = work.author_id
        WHERE is_maior = 1 AND work.abbr IS NULL
    ;

    /* 3. add editions -> cannot use aggr-functions with mariadb 10.3.28! */
    UPDATE opera_maiora_temp SET
        opera_maiora_temp.editions_id = CONCAT('[',(SELECT GROUP_CONCAT(edition.id SEPARATOR ',') FROM edition WHERE edition.work_id = opera_maiora_temp.work_id),']');
    UPDATE opera_maiora_temp SET
        opera_maiora_temp.editions_url = CONCAT('["',(SELECT GROUP_CONCAT(IF(url IS NULL, "", url) SEPARATOR '","') FROM edition WHERE edition.work_id = opera_maiora_temp.work_id),'"]');
    UPDATE opera_maiora_temp SET
        opera_maiora_temp.editions_label = CONCAT('["',(SELECT GROUP_CONCAT(IF(label IS NULL, "FEHLER", label) SEPARATOR '","') FROM edition WHERE edition.work_id = opera_maiora_temp.work_id),'"]');

    /* 4. add authors on separat line */
    INSERT INTO opera_maiora_temp
    (author_id, date_display, abbr, full, comment, author_sort, work_sort, gq_author_id)
        SELECT author.id, author.date_display, IF(author.in_use != 1, CONCAT('[', author.abbr, ']'), author.abbr), author.full, author.txt_info, author.abbr_sort, "", author.gq_id
        FROM author
        WHERE (SELECT COUNT(work.id) FROM work WHERE work.author_id = author.id AND work.is_maior = 1 AND work.abbr IS NOT NULL) > 0 AND (SELECT COUNT(work.id) FROM work WHERE work.author_id = author.id AND work.is_maior = 1 AND work.abbr IS NULL) = 0
    ;

    /* 5. sort and insert into final table */
    CREATE OR REPLACE TABLE opera_maiora (id INT PRIMARY KEY AUTO_INCREMENT, author_id INT, work_id INT, date_display VARCHAR(200), abbr VARCHAR(200), full TEXT, search VARCHAR(300), bibliography TEXT, comment TEXT, editions_id JSON, editions_url JSON, editions_label JSON, gq_author_id INT, gq_work_id INT, same_line BOOL);
    INSERT INTO opera_maiora
    (author_id, work_id, date_display, abbr, full, search, bibliography, comment, editions_id, editions_url, editions_label, gq_work_id, gq_author_id, same_line)
        SELECT author_id, work_id, date_display, abbr, full, search, bibliography, comment, editions_id, editions_url, editions_label, gq_work_id, gq_author_id, same_line
        FROM opera_maiora_temp
        ORDER BY opera_maiora_temp.author_sort, opera_maiora_temp.work_sort
    ;
    DROP TABLE opera_maiora_temp;









/* opera minora */
    CREATE OR REPLACE TABLE opera_minora_temp (id INT PRIMARY KEY AUTO_INCREMENT, author_id INT, work_id INT, date_display VARCHAR(200), citation TEXT, bibliography TEXT, search VARCHAR(300), editions_id JSON, editions_url JSON, editions_label JSON, gq_author_id INT, gq_work_id INT);

    INSERT INTO opera_minora_temp(author_id, work_id, date_display, citation, bibliography, search, gq_work_id, gq_author_id) SELECT author.id, work.id, work.date_display, CONCAT(IF(work.in_use = 0, "<del>", ""), REPLACE(work.opus, " <cit></cit> ( <cit_bib></cit_bib>)", ""), IF(work.in_use = 0, "</del>", ""), IF(work.reference IS NOT NULL AND work.reference != "", CONCAT("&nbsp;&nbsp;&nbsp;<i>v.</i> ", work.reference), "")), work.txt_info, work.ac_web, work.gq_id, author.gq_id FROM work LEFT JOIN author ON author.id = work.author_id WHERE is_maior = 0 ORDER By author.abbr_sort, work.abbr_sort;
    UPDATE opera_minora_temp SET
        editions_id = CONCAT('[',(SELECT GROUP_CONCAT(id SEPARATOR ',') FROM edition WHERE edition.work_id = opera_minora_temp.work_id),']');
    UPDATE opera_minora_temp SET
        editions_url = CONCAT('["',(SELECT GROUP_CONCAT(IF(url IS NULL, "", url) SEPARATOR '","') FROM edition WHERE edition.work_id = opera_minora_temp.work_id),'"]');
    UPDATE opera_minora_temp SET
        editions_label = CONCAT('["',(SELECT GROUP_CONCAT(IF(label IS NULL, "FEHLER", label) SEPARATOR '","') FROM edition WHERE edition.work_id = opera_minora_temp.work_id),'"]');

    CREATE OR REPLACE TABLE opera_minora (id INT PRIMARY KEY AUTO_INCREMENT, author_id INT, work_id INT, date_display VARCHAR(200), citation TEXT, bibliography TEXT, search VARCHAR(300), editions_id JSON, editions_url JSON, editions_label JSON, gq_author_id INT, gq_work_id INT);
    INSERT INTO opera_minora
    (author_id, work_id, date_display, citation, bibliography, search, editions_id, editions_url, editions_label, gq_work_id, gq_author_id)
        SELECT author_id, work_id, date_display, citation, bibliography, search, editions_id, editions_url, editions_label, gq_work_id, gq_author_id
        FROM opera_minora_temp
    ;
    DROP TABLE opera_minora_temp;


/* scan viewer list */
    CREATE OR REPLACE TABLE scan_viewer_temp (id INT PRIMARY KEY AUTO_INCREMENT, author_id INT, work_id INT, date_display VARCHAR(200), citation TEXT, bibliography TEXT, search VARCHAR(300), in_use INT, editions_id JSON, editions_url JSON, editions_label JSON, editions_type JSON);

    INSERT INTO scan_viewer_temp(author_id, work_id, date_display, citation, bibliography, search, in_use) SELECT author.id, work.id, work.date_display, CONCAT(IF(work.in_use = 0, "<del>", ""), REPLACE(work.opus, " <cit></cit> ( <cit_bib></cit_bib>)", ""), IF(work.in_use = 0, "</del>", ""), IF(work.reference IS NOT NULL AND work.reference != "", CONCAT("&nbsp;&nbsp;&nbsp;<i>v.</i> ", work.reference), "")), work.txt_info, work.ac_web, IF(work.in_use=1 AND author.in_use=1,1,0) FROM work LEFT JOIN author ON author.id = work.author_id ORDER By IF(is_maior=1,0,1), author.abbr_sort, work.abbr_sort;
    UPDATE scan_viewer_temp SET
        editions_id = CONCAT('[',(SELECT GROUP_CONCAT(id SEPARATOR ',') FROM edition WHERE edition.work_id = scan_viewer_temp.work_id),']');
    UPDATE scan_viewer_temp SET
        editions_url = CONCAT('["',(SELECT GROUP_CONCAT(IF(url IS NULL, "", url) SEPARATOR '","') FROM edition WHERE edition.work_id = scan_viewer_temp.work_id),'"]');
    UPDATE scan_viewer_temp SET
        editions_label = CONCAT('["',(SELECT GROUP_CONCAT(IF(label IS NULL, "FEHLER", label) SEPARATOR '","') FROM edition WHERE edition.work_id = scan_viewer_temp.work_id),'"]');
    UPDATE scan_viewer_temp SET
        editions_type = CONCAT('[',(SELECT GROUP_CONCAT(IF(ressource IS NULL, 5, ressource) SEPARATOR ',') FROM edition WHERE edition.work_id = scan_viewer_temp.work_id),']');

    CREATE OR REPLACE TABLE scan_opera (id INT PRIMARY KEY AUTO_INCREMENT, author_id INT, work_id INT, date_display VARCHAR(200), citation TEXT, bibliography TEXT, search VARCHAR(300), in_use INT, editions_id JSON, editions_url JSON, editions_label JSON, editions_type JSON);
    INSERT INTO scan_opera
    (author_id, work_id, date_display, citation, bibliography, search, in_use, editions_id, editions_url, editions_label, editions_type)
        SELECT author_id, work_id, date_display, citation, bibliography, search, in_use, editions_id, editions_url, editions_label, editions_type
        FROM scan_viewer_temp
    ;
    DROP TABLE scan_viewer_temp;

    CREATE OR REPLACE TABLE scan_paths (id INT, path VARCHAR(2000), count INT);
    INSERT INTO scan_paths (id, path, count) SELECT id, path, COUNT(id) FROM scan GROUP BY path ORDER BY path;
END; //
DELIMITER ;