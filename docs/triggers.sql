DELIMITER //
CREATE OR REPLACE TRIGGER ocr_jobs_create
BEFORE INSERT ON ocr_jobs
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER ocr_jobs_update
BEFORE UPDATE ON ocr_jobs 
FOR EACH ROW
    BEGIN
        SET new.u_date = SYSDATE(6);
    END; //
DELIMITER ;

/* ***************************************************** */
DELIMITER //
CREATE OR REPLACE TRIGGER seklit_create
BEFORE INSERT ON seklit
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER seklit_update
BEFORE UPDATE ON seklit 
FOR EACH ROW
    BEGIN
        SET new.u_date = SYSDATE(6);
    END; //
DELIMITER ;

/* ***************************************************** */
DELIMITER //
CREATE OR REPLACE TRIGGER article_create
BEFORE INSERT ON article 
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
        UPDATE project
        SET project.deleted = project.deleted
        WHERE project.id = new.project_id;
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER article_update
BEFORE UPDATE ON article 
FOR EACH ROW
    BEGIN
        SET new.u_date = SYSDATE(6);
        UPDATE project
        SET project.deleted = project.deleted
        WHERE project.id = new.project_id;
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER author_create
BEFORE INSERT ON author 
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER author_update
BEFORE UPDATE ON author
FOR EACH ROW
    BEGIN
        SET new.u_date = SYSDATE(6);
        IF new.gq_id IS NOT NULL THEN
            SET new.gq_author = (SELECT autor_lat FROM gq_autoren WHERE gq_id = new.gq_id);
        ELSE
            SET new.gq_author = NULL;
        END IF;
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER comment_create
BEFORE INSERT ON comment 
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
        SET new.user = (
            SELECT CONCAT(LEFT(user.first_name, 1), ". ", user.last_name)
            FROM user
            WHERE new.user_id = user.id
        );
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER comment_update
BEFORE UPDATE ON comment 
FOR EACH ROW
    BEGIN
        SET new.u_date = SYSDATE(6);
        SET new.user = (
            SELECT CONCAT(LEFT(user.first_name,1), ". ", user.last_name)
            FROM user
            WHERE new.user_id = user.id
        );
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER edition_create
BEFORE INSERT ON edition 
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
        SET new.opus = (SELECT opus FROM work WHERE work.id = new.work_id);
        SET new.ac_web = (SELECT ac_web FROM work WHERE work.id = new.work_id);
        IF (new.ressource = 0 OR new.ressource = 1) AND new.serie = 1 THEN
            /* Migne/PL */
            SET new.label = CONCAT("PL ", new.volume);
        ELSEIF (new.ressource = 0 OR new.ressource = 1) AND new.serie = 2 THEN
            /* ASBen. */
            SET new.label = CONCAT("ASBen. ", new.volume);
        ELSEIF (new.ressource = 0 OR new.ressource = 1) AND new.serie = 3 THEN
            /* ASBoll. */
            SET new.label = CONCAT("ASBoll. ", new.volume);
        ELSEIF (new.ressource = 0 OR new.ressource = 1) AND new.serie = 4 THEN
            /* AnalBoll. */
            SET new.label = CONCAT("AnalBoll. ", new.volume);
        ELSEIF (new.ressource = 0 OR new.ressource = 1) AND new.serie = 5 THEN
            /* Mon. Boica */
            SET new.label = CONCAT("Mon. Boica ", new.volume);
        ELSEIF (new.ressource = 0 OR new.ressource = 1) AND new.serie = 6 THEN
            /* Ma. Schatzverzeichnisse */
            SET new.label = CONCAT("Ma. Schatzverzeichnisse ", new.volume);
        ELSEIF (new.ressource = 0 OR new.ressource = 1) AND new.serie = 7 THEN
            /* Ma. Bibliothekskataloge */
            SET new.label = CONCAT("Ma. Bibliothekskataloge ", new.volume);
        ELSEIF new.ressource = 1 THEN
            /* Edition veraltet */
            SET new.label = CONCAT("[", new.editor, " ", new.year, "]");
        ELSEIF new.ressource = 2 THEN
            /*Handschrift*/
            SET new.label = CONCAT("cod. ", new.signature);
        ELSEIF new.ressource = 3 THEN
            /*alter Druck*/
            SET new.label = CONCAT(new.editor, " ", new.location);
        ELSEIF new.ressource = 4 THEN
            /* alter Druck, veraltet */
            SET new.label = CONCAT("[", new.editor, " ", new.location, "]");
        ELSE
            /*0: Edition relevant; 5: sonstiges*/
            SET new.label = CONCAT(
                new.editor,
                " ",
                new.year,
                IF(
                    (new.volume != "" AND new.volume IS NOT NULL) OR (new.vol_cont != "" AND new.vol_cont IS NOT NULL),
                    " (",
                    ""
                ),
                IF(
                    new.volume != "" AND new.volume IS NOT NULL,
                    new.volume,
                    ""
                ),
                IF(
                    new.vol_cont != "" AND new.vol_cont IS NOT NULL,
                    CONCAT(
                        if(new.volume!="" AND new.volume IS NOT NULL, " ", ""),
                        new.vol_cont
                    ),
                    ""
                ),
                IF(
                    (new.volume != "" AND new.volume IS NOT NULL) OR (new.vol_cont != "" AND new.vol_cont IS NOT NULL),
                    ")",
                    ""
                )
            );
        END IF;
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER edition_update
BEFORE UPDATE ON edition
FOR EACH ROW
    BEGIN
        SET new.u_date = SYSDATE(6);
        IF new.work_id != old.work_id OR (old.work_id IS NULL AND new.work_id IS NOT NULL) OR (old.work_id IS NOT NULL AND new.work_id IS NULL) THEN
            SET new.opus = (SELECT opus FROM work WHERE work.id = new.work_id);
            SET new.ac_web = (SELECT ac_web FROM work WHERE work.id = new.work_id);
        END IF;
        IF (new.ressource = 0 OR new.ressource = 1) AND new.serie = 1 THEN
            /* Migne/PL */
            SET new.label = CONCAT("PL ", new.volume);
        ELSEIF (new.ressource = 0 OR new.ressource = 1) AND new.serie = 2 THEN
            /* ASBen. */
            SET new.label = CONCAT("ASBen. ", new.volume);
        ELSEIF (new.ressource = 0 OR new.ressource = 1) AND new.serie = 3 THEN
            /* ASBoll. */
            SET new.label = CONCAT("ASBoll. ", new.volume);
        ELSEIF (new.ressource = 0 OR new.ressource = 1) AND new.serie = 4 THEN
            /* AnalBoll. */
            SET new.label = CONCAT("AnalBoll. ", new.volume);
        ELSEIF (new.ressource = 0 OR new.ressource = 1) AND new.serie = 5 THEN
            /* Mon. Boica */
            SET new.label = CONCAT("Mon. Boica ", new.volume);
        ELSEIF (new.ressource = 0 OR new.ressource = 1) AND new.serie = 6 THEN
            /* Ma. Schatzverzeichnisse */
            SET new.label = CONCAT("Ma. Schatzverzeichnisse ", new.volume);
        ELSEIF (new.ressource = 0 OR new.ressource = 1) AND new.serie = 7 THEN
            /* Ma. Bibliothekskataloge */
            SET new.label = CONCAT("Ma. Bibliothekskataloge ", new.volume);
        ELSEIF new.ressource = 1 THEN
            /* Edition veraltet */
            SET new.label = CONCAT("[", new.editor, " ", new.year, "]");
        ELSEIF new.ressource = 2 THEN
            /*Handschrift*/
            SET new.label = CONCAT("cod. ", new.signature);
        ELSEIF new.ressource = 3 THEN
            /*alter Druck*/
            SET new.label = CONCAT(new.editor, " ", new.location);
        ELSEIF new.ressource = 4 THEN
            /* alter Druck, veraltet */
            SET new.label = CONCAT("[", new.editor, " ", new.location, "]");
        ELSE
            /*0: Edition relevant; 5: sonstiges*/
            SET new.label = CONCAT(
                new.editor,
                " ",
                new.year,
                IF(
                    (new.volume != "" AND new.volume IS NOT NULL) OR (new.vol_cont != "" AND new.vol_cont IS NOT NULL),
                    " (",
                    ""
                ),
                IF(
                    new.volume != "" AND new.volume IS NOT NULL,
                    new.volume,
                    ""
                ),
                IF(
                    new.vol_cont != "" AND new.vol_cont IS NOT NULL,
                    CONCAT(
                        if(new.volume!="" AND new.volume IS NOT NULL, " ", ""),
                        new.vol_cont
                    ),
                    ""
                ),
                IF(
                    (new.volume != "" AND new.volume IS NOT NULL) OR (new.vol_cont != "" AND new.vol_cont IS NOT NULL),
                    ")",
                    ""
                )
            );
        END IF;
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER lemma_create
BEFORE INSERT ON lemma
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
        SET new.zettel_count = 0;
        SET new.comments_count = 0;
        SET new.lemma_search = LOWER(new.lemma);
        SET new.lemma_ac = REMOVEHTML(new.lemma_display);
        IF new.lemma_nr IS NULL THEN
            SET new.lemma_nr = 0;
        END IF;
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER lemma_update
BEFORE UPDATE ON lemma
FOR EACH ROW
    BEGIN
        SET new.u_date = SYSDATE(6);
        SET new.lemma_search = LOWER(new.lemma);
        SET new.lemma_ac = REMOVEHTML(new.lemma_display);
        UPDATE zettel
        SET
            zettel.lemma = new.lemma,
            zettel.lemma_nr = new.lemma_nr,
            zettel.lemma_search = new.lemma_search,
            zettel.lemma_display = new.lemma_display,
            zettel.lemma_ac = REMOVEHTML(new.lemma_display)
        WHERE zettel.lemma_id = new.id;
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER project_create
BEFORE INSERT ON project
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER project_update
BEFORE UPDATE ON project
FOR EACH ROW
    BEGIN
        SET new.u_date = SYSDATE(6);
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER scan_create
BEFORE INSERT ON scan
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER scan_update
BEFORE UPDATE ON scan
FOR EACH ROW
    BEGIN
        SET new.u_date = SYSDATE(6);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER scan_update_after
AFTER UPDATE ON scan
FOR EACH ROW
    BEGIN
        UPDATE scan_lnk SET deleted = deleted WHERE scan_lnk.scan_id = new.id;
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER scan_lnk_create
BEFORE INSERT ON scan_lnk
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
        IF new.scan_id IS NOT NULL THEN
            SET new.filename = (SELECT filename FROM scan WHERE scan.id=new.scan_id);
            SET new.full_text = (SELECT IF(full_text IS NOT NULL, full_text, ocr_auto) FROM scan WHERE scan.id=new.scan_id);
            SET new.auto_text = (SELECT IF(full_text IS NULL AND ocr_auto IS NOT NULL, 1, 0) FROM scan WHERE scan.id=new.scan_id);
            SET new.body_matter = (SELECT body_matter FROM scan WHERE scan.id=new.scan_id);
        END IF;
        IF new.edition_id IS NOT NULL THEN
            SET new.ac_web = (SELECT edition.ac_web FROM edition WHERE edition.id=new.edition_id);
        END IF;
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER scan_lnk_update
BEFORE UPDATE ON scan_lnk
FOR EACH ROW
    BEGIN
        SET new.u_date = SYSDATE(6);
        SET new.filename = (SELECT filename FROM scan WHERE scan.id=new.scan_id);
        SET new.full_text = (SELECT IF(full_text IS NOT NULL, full_text, ocr_auto) FROM scan WHERE scan.id=new.scan_id);
        SET new.auto_text = (SELECT IF(full_text IS NULL AND ocr_auto IS NOT NULL, 1, 0) FROM scan WHERE scan.id=new.scan_id);
        SET new.body_matter = (SELECT body_matter FROM scan WHERE scan.id=new.scan_id);
        IF new.scan_id IS NOT NULL THEN
            SET new.filename = (SELECT filename FROM scan WHERE scan.id=new.scan_id);
            SET new.full_text = (SELECT IF(full_text IS NOT NULL, full_text, ocr_auto) FROM scan WHERE scan.id=new.scan_id);
            SET new.auto_text = (SELECT IF(full_text IS NULL AND ocr_auto IS NOT NULL, 1, 0) FROM scan WHERE scan.id=new.scan_id);
            SET new.body_matter = (SELECT body_matter FROM scan WHERE scan.id=new.scan_id);
        END IF;
        IF (old.edition_id IS NULL AND new.edition_id IS NOT NULL) OR (old.edition_id != new.edition_id) THEN
            SET new.ac_web = (SELECT edition.ac_web FROM edition WHERE edition.id=new.edition_id);
        END IF;
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER user_create
BEFORE INSERT ON user
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER user_update
BEFORE UPDATE ON user
FOR EACH ROW
    BEGIN
        SET new.u_date = SYSDATE(6);
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER work_create
BEFORE INSERT ON work
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
        SET new.ac_vsc = (
            SELECT 
                CONCAT(
                    IF(new.in_use = 0 OR author.in_use = 0, "[", ""),
                    UPPER(IF(new.author_display IS NULL OR new.author_display = '', author.abbr, new.author_display)),
                    IF(new.abbr IS NULL OR new.abbr = "", "", CONCAT(" ", new.abbr)),
                    IF(new.in_use = 0 OR author.in_use = 0, "]", ""),
                    IF(new.is_maior = 1, "", CONCAT(
                        "; ",
                        IF(new.citation = "" OR new.citation IS NULL, "", CONCAT(new.citation, " ")),
                        "((",
                        IF(new.bibliography IS NULL, "", new.bibliography),
                        IF(new.bibliography_cit IS NULL, "", CONCAT("; ", new.bibliography_cit)),
                        "))"
                    ))
                )
            FROM author WHERE author.id = new.author_id
        );
        SET new.ac_web = (
            SELECT 
                CONCAT(
                    IF(new.in_use = 0 OR author.in_use = 0, "[", ""),
                    UPPER(IF(new.author_display IS NULL OR new.author_display = '', author.abbr, new.author_display)),
                    IF(new.abbr IS NULL OR new.abbr = "", "", CONCAT(" ", new.abbr)),
                    IF(new.in_use = 0 OR author.in_use = 0, "]", ""),
                    IF(new.is_maior = 1, "",
                        CONCAT(
                            "; ",
                            IF(new.citation = "" OR new.citation IS NULL, "", CONCAT(new.citation, " ")),
                            "(",
                            IF(new.bibliography IS NULL, "", new.bibliography),
                            IF(new.bibliography_cit IS NULL, "", CONCAT(" ", new.bibliography_cit)),
                            ")"
                        )
                    )
                )
            FROM author WHERE author.id = new.author_id
        );
        SET new.opus = (
            SELECT CONCAT(
                IF(new.in_use=1, '', '['),
                IF(author.in_use=1, '<aut>', '[<aut>'),
                IF(new.author_display IS NULL OR new.author_display = "", author.abbr, new.author_display),
                IF(author.in_use=1, '</aut>', '</aut>]'),
                IF(new.abbr IS NULL,'',CONCAT(' ', new.abbr)),
                CONCAT(' <cit>', IF(new.is_maior=1, '', IF(new.citation IS NULL OR new.citation = '', '', new.citation)), '</cit>'),
                IF(new.is_maior=1, '', CONCAT(' (', IF(new.bibliography IS NULL, '', new.bibliography), ' <cit_bib>',
                    IF(new.bibliography_cit IS NULL OR new.bibliography_cit = '', '', new.bibliography_cit),
                    '</cit_bib>)')),
                IF(new.in_use=1, '', ']')
            ) FROM author WHERE new.author_id = author.id
        );
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER work_update
BEFORE UPDATE ON work
FOR EACH ROW
    BEGIN
        SET new.u_date = SYSDATE(6);
        SET new.ac_vsc = (
            SELECT 
                CONCAT(
                    IF(new.in_use = 0 OR author.in_use = 0, "[", ""),
                    UPPER(IF(new.author_display IS NULL OR new.author_display = '', author.abbr, new.author_display)),
                    IF(new.abbr IS NULL OR new.abbr = "", "", CONCAT(" ", new.abbr)),
                    IF(new.in_use = 0 OR author.in_use = 0, "]", ""),
                    IF(new.is_maior = 1, "", CONCAT(
                        "; ",
                        IF(new.citation = "" OR new.citation IS NULL, "", CONCAT(new.citation, " ")),
                        "((",
                        IF(new.bibliography IS NULL, "", new.bibliography),
                        IF(new.bibliography_cit IS NULL, "", CONCAT("; ", new.bibliography_cit)),
                        "))"
                    ))
                )
            FROM author WHERE author.id = new.author_id
        );
        SET new.ac_web = (
            SELECT 
                CONCAT(
                    IF(new.in_use = 0 OR author.in_use = 0, "[", ""),
                    UPPER(IF(new.author_display IS NULL OR new.author_display = '', author.abbr, new.author_display)),
                    IF(new.abbr IS NULL OR new.abbr = "", "", CONCAT(" ", new.abbr)),
                    IF(new.in_use = 0 OR author.in_use = 0, "]", ""),
                    IF(new.is_maior = 1, "",
                        CONCAT(
                            "; ",
                            IF(new.citation = "" OR new.citation IS NULL, "", CONCAT(new.citation, " ")),
                            "(",
                            IF(new.bibliography IS NULL, "", new.bibliography),
                            IF(new.bibliography_cit IS NULL, "", CONCAT(" ", new.bibliography_cit)),
                            ")"
                        )
                    )
                )
            FROM author WHERE author.id = new.author_id
        );
        SET new.opus = (
            SELECT CONCAT(
                IF(new.in_use=1, '', '['),
                IF(author.in_use=1, '<aut>', '[<aut>'),
                IF(new.author_display IS NULL OR new.author_display = "", author.abbr, new.author_display),
                IF(author.in_use=1, '</aut>', '</aut>]'),
                IF(new.abbr IS NULL,'',CONCAT(' ', new.abbr)),
                CONCAT(' <cit>', IF(new.is_maior=1, '', IF(new.citation IS NULL OR new.citation = '', '', new.citation)), '</cit>'),
                IF(new.is_maior=1, '', CONCAT(' (', IF(new.bibliography IS NULL, '', new.bibliography), ' <cit_bib>',
                    IF(new.bibliography_cit IS NULL OR new.bibliography_cit = '', '', new.bibliography_cit),
                    '</cit_bib>)')),
                IF(new.in_use=1, '', ']')
            ) FROM author WHERE new.author_id = author.id
        );
        IF new.date_sort != old.date_sort OR new.date_type != new.date_type THEN
            UPDATE zettel
            SET
                zettel.date_sort = new.date_sort,
                zettel.date_type = new.date_type
            WHERE zettel.lemma_id = new.id;
        END IF;
        UPDATE edition
        SET
            edition.opus = new.opus,
            edition.ac_web = new.ac_web
        WHERE edition.work_id = new.id;
        IF new.gq_id IS NOT NULL THEN
            SET new.gq_work = (SELECT opus FROM gq_werke WHERE gq_id = new.gq_id);
        ELSE
            SET new.gq_work = NULL;
        END IF;
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER zettel_create
BEFORE INSERT ON zettel
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
        SET new.img_path = CONCAT('/zettel/',
            new.letter, '/',
            new.img_folder, '/',
            IF(new.sibling IS NULL OR new.sibling = 0, new.id, new.sibling));
        IF new.lemma_id IS NOT NULL THEN
            SET new.lemma = (SELECT lemma FROM lemma WHERE new.lemma_id = lemma.id);
            SET new.lemma_nr = (SELECT lemma_nr FROM lemma WHERE new.lemma_id = lemma.id);
            SET new.lemma_search = (SELECT lemma_search FROM lemma WHERE new.lemma_id = lemma.id);
            SET new.lemma_display = (SELECT lemma_display FROM lemma WHERE new.lemma_id = lemma.id);
            SET new.lemma_ac = (SELECT REMOVEHTML(lemma_display) FROM lemma WHERE new.lemma_id = lemma.id);
        ELSE
            SET new.lemma = "";
            SET new.lemma_nr = 0;
            SET new.lemma_search = "";
            SET new.lemma_display = "";
        END IF;
        IF new.work_id IS NOT NULL THEN
            SET new.ac_web = (SELECT work.ac_web FROM work WHERE new.work_id = work.id);
            SET new.opus = (
                SELECT
                IF(new.stellenangabe IS NULL OR new.stellenangabe = "", IF(new.stellenangabe_bib IS NULL OR new.stellenangabe_bib = "", 
                        work.opus,
                        UPDATEXML(work.opus, '/cit_bib', new.stellenangabe_bib)
                    ),
                    IF(new.stellenangabe_bib IS NULL OR new.stellenangabe_bib = "",
                        UPDATEXML(work.opus, '/cit', new.stellenangabe),
                        UPDATEXML(UPDATEXML(work.opus, '/cit', new.stellenangabe), '/cit_bib', new.stellenangabe_bib)

                    )
                )
                FROM work WHERE new.work_id = work.id
            );
            SET new.date_sort = (
                SELECT
                IF(work.date_type = 9 OR work.date_type IS NULL,
                    IF(new.date_own IS NULL, 0, new.date_own),
                    IF(new.date_own IS NULL OR new.date_own = 0, work.date_sort, new.date_own)
                )
                FROM work WHERE new.work_id = work.id
            );
            SET new.date_display = (
                SELECT
                IF(new.date_own IS NULL OR new.date_own = 0,
                    work.date_display,
                    IF(new.date_own_display IS NULL OR new.date_own_display ="",new.date_own,new.date_own_display)
                )
                FROM work WHERE new.work_id = work.id
            );
            SET new.date_type = (SELECT IF(work.date_type IS NULL, 0, work.date_type) FROM work WHERE new.work_id = work.id);
        ELSE
            SET new.date_sort = IF(new.date_own IS NULL, 0, new.date_own);
            SET new.date_type = 0;
        END IF;
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER zettel_update
BEFORE UPDATE ON zettel
FOR EACH ROW
    BEGIN
        IF !(old.ocr_text IS NULL AND new.ocr_text IS NOT NULL) THEN
            SET new.u_date = SYSDATE(6);
        END IF;
        IF new.lemma_id != old.lemma_id OR (old.lemma_id IS NULL AND new.lemma_id IS NOT NULL) OR (old.lemma_id IS NOT NULL AND new.lemma_id IS NULL) THEN
            SET new.lemma = (SELECT lemma FROM lemma WHERE new.lemma_id = lemma.id);
            SET new.lemma_nr = (SELECT lemma_nr FROM lemma WHERE new.lemma_id = lemma.id);
            SET new.lemma_search = (SELECT lemma_search FROM lemma WHERE new.lemma_id = lemma.id);
            SET new.lemma_display = (SELECT lemma_display FROM lemma WHERE new.lemma_id = lemma.id);
            SET new.lemma_ac = (SELECT REMOVEHTML(lemma_display) FROM lemma WHERE new.lemma_id = lemma.id);
        END IF;
        IF new.work_id != old.work_id OR (old.work_id IS NULL AND new.work_id IS NOT NULL) OR (old.work_id IS NOT NULL AND new.work_id IS NULL) THEN
            SET new.ac_web = (SELECT work.ac_web FROM work WHERE new.work_id = work.id);
            SET new.opus = (
                SELECT
                IF(new.stellenangabe IS NULL OR new.stellenangabe = "", IF(new.stellenangabe_bib IS NULL OR new.stellenangabe_bib = "", 
                        work.opus,
                        UPDATEXML(work.opus, '/cit_bib', new.stellenangabe_bib)
                    ),
                    IF(new.stellenangabe_bib IS NULL OR new.stellenangabe_bib = "",
                        UPDATEXML(work.opus, '/cit', new.stellenangabe),
                        UPDATEXML(UPDATEXML(work.opus, '/cit', new.stellenangabe), '/cit_bib', new.stellenangabe_bib)

                    )
                )
                FROM work WHERE new.work_id = work.id
            );
            SET new.date_sort = (
                SELECT
                IF(work.date_type = 9 OR work.date_type IS NULL,
                    IF(new.date_own IS NULL, 0, new.date_own),
                    IF(new.date_own IS NULL OR new.date_own = 0, work.date_sort, new.date_own)
                )
                FROM work WHERE new.work_id = work.id
            );
            SET new.date_display = (
                SELECT
                IF(new.date_own IS NULL OR new.date_own = 0,
                    work.date_display,
                    IF(new.date_own_display IS NULL OR new.date_own_display ="",new.date_own,new.date_own_display)
                )
                FROM work WHERE new.work_id = work.id
            );
            SET new.date_type = (SELECT IF(work.date_type IS NULL, 0, work.date_type) FROM work WHERE new.work_id = work.id);
        /*ELSE
            SET new.date_sort = IF(new.date_own IS NULL, 0, new.date_own);
            SET new.date_type = 0;*/
        END IF;
        UPDATE zettel_lnk
        SET
            zettel_lnk.date_sort = new.date_sort,
            zettel_lnk.date_type = new.date_type,
            zettel_lnk.lemma_search = new.lemma_search,
            zettel_lnk.lemma_nr = new.lemma_nr,
            zettel_lnk.ac_web = new.ac_web,
            zettel_lnk.stellenangabe = new.stellenangabe,
            zettel_lnk.type = new.type
        WHERE zettel_lnk.zettel_id = new.id;
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER sections_create
BEFORE INSERT ON sections 
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
        UPDATE project
        SET project.deleted = project.deleted
        WHERE project.id = new.project_id;
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER sections_update
BEFORE UPDATE ON sections 
FOR EACH ROW
    BEGIN
        SET new.u_date = SYSDATE(6);
        UPDATE project
        SET project.deleted = project.deleted
        WHERE project.id = new.project_id;
    END; //
DELIMITER ;


/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER tags_create
BEFORE INSERT ON tags 
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
        UPDATE project
        SET project.deleted = project.deleted
        WHERE project.id = new.project_id;
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER tags_update
BEFORE UPDATE ON tags 
FOR EACH ROW
    BEGIN
        SET new.u_date = SYSDATE(6);
        UPDATE project
        SET project.deleted = project.deleted
        WHERE project.id = new.project_id;
    END; //
DELIMITER ;
/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER tag_lnks_create
BEFORE INSERT ON tag_lnks 
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
        UPDATE project
        SET project.deleted = project.deleted
        WHERE project.id = new.project_id;
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER tag_lnks_update
BEFORE UPDATE ON tag_lnks 
FOR EACH ROW
    BEGIN
        SET new.u_date = SYSDATE(6);
        UPDATE project
        SET project.deleted = project.deleted
        WHERE project.id = new.project_id;
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER zettel_lnk_create
BEFORE INSERT ON zettel_lnk
FOR EACH ROW
    BEGIN
        SET new.c_date = SYSDATE(6);
        SET new.u_date = SYSDATE(6);
        SET new.date_sort = (SELECT zettel.date_sort FROM zettel WHERE new.zettel_id = zettel.id);
        SET new.date_type = (SELECT zettel.date_type FROM zettel WHERE new.zettel_id = zettel.id);
        SET new.lemma_search = (SELECT zettel.lemma_search FROM zettel WHERE new.zettel_id = zettel.id);
        SET new.lemma_nr = (SELECT zettel.lemma_nr FROM zettel WHERE new.zettel_id = zettel.id);
        SET new.ac_web = (SELECT zettel.ac_web FROM zettel WHERE new.zettel_id = zettel.id);
        SET new.stellenangabe = (SELECT zettel.stellenangabe FROM zettel WHERE new.zettel_id = zettel.id);
        SET new.type = (SELECT zettel.type FROM zettel WHERE new.zettel_id = zettel.id);
        SET new.display_text = (SELECT zettel.txt FROM zettel WHERE new.zettel_id = zettel.id);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER zettel_lnk_update
BEFORE UPDATE ON zettel_lnk
FOR EACH ROW
    BEGIN
        SET new.u_date = SYSDATE(6);
    END; //
DELIMITER ;


/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER gq_werke_create
BEFORE INSERT ON gq_werke
FOR EACH ROW
    BEGIN
        SET new.opus = IF(new.gq_autor_id IS NOT NULL, CONCAT((SELECT autor_lat FROM gq_autoren WHERE gq_id = new.gq_autor_id), " ", new.werk_lat), new.werk_lat);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER gq_werke_update
BEFORE UPDATE ON gq_werke
FOR EACH ROW
    BEGIN
        SET new.opus = IF(new.gq_autor_id IS NOT NULL, CONCAT((SELECT autor_lat FROM gq_autoren WHERE gq_id = new.gq_autor_id), " ", new.werk_lat), new.werk_lat);
    END; //
DELIMITER ;
