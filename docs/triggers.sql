DELIMITER //
CREATE OR REPLACE TRIGGER article_create
BEFORE INSERT ON article 
FOR EACH ROW
    BEGIN
        SET new.c_date = NOW(6);
        SET new.u_date = NOW(6);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER article_update
BEFORE UPDATE ON article 
FOR EACH ROW
    BEGIN
        SET new.u_date = NOW(6);
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER author_create
BEFORE INSERT ON author 
FOR EACH ROW
    BEGIN
        SET new.c_date = NOW(6);
        SET new.u_date = NOW(6);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER author_update
BEFORE UPDATE ON author
FOR EACH ROW
    BEGIN
        SET new.u_date = NOW(6);
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER comment_create
BEFORE INSERT ON comment 
FOR EACH ROW
    BEGIN
        SET new.c_date = NOW(6);
        SET new.u_date = NOW(6);
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
        SET new.u_date = NOW(6);
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
        SET new.c_date = NOW(6);
        SET new.u_date = NOW(6);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER edition_update
BEFORE UPDATE ON edition
FOR EACH ROW
    BEGIN
        SET new.u_date = NOW(6);
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER lemma_create
BEFORE INSERT ON lemma
FOR EACH ROW
    BEGIN
        SET new.c_date = NOW(6);
        SET new.u_date = NOW(6);
        SET new.zettel_count = 0;
        SET new.comments_count = 0;
        SET new.lemma_search = LOWER(new.lemma);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER lemma_update
BEFORE UPDATE ON lemma
FOR EACH ROW
    BEGIN
        SET new.u_date = NOW(6);
        SET new.lemma_search = LOWER(new.lemma);
        UPDATE zettel
        SET
            zettel.lemma = new.lemma,
            zettel.lemma_nr = new.lemma_nr,
            zettel.lemma_search = new.lemma_search,
            zettel.lemma_display = new.lemma_display
        WHERE zettel.lemma_id = new.id;
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER project_create
BEFORE INSERT ON project
FOR EACH ROW
    BEGIN
        SET new.c_date = NOW(6);
        SET new.u_date = NOW(6);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER project_update
BEFORE UPDATE ON project
FOR EACH ROW
    BEGIN
        SET new.u_date = NOW(6);
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER scan_create
BEFORE INSERT ON scan
FOR EACH ROW
    BEGIN
        SET new.c_date = NOW(6);
        SET new.u_date = NOW(6);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER scan_update
BEFORE UPDATE ON scan
FOR EACH ROW
    BEGIN
        SET new.u_date = NOW(6);
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER scan_create
BEFORE INSERT ON scan
FOR EACH ROW
    BEGIN
        SET new.c_date = NOW(6);
        SET new.u_date = NOW(6);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER scan_update
BEFORE UPDATE ON scan
FOR EACH ROW
    BEGIN
        SET new.u_date = NOW(6);
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER user_create
BEFORE INSERT ON user
FOR EACH ROW
    BEGIN
        SET new.c_date = NOW(6);
        SET new.u_date = NOW(6);
    END; //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE TRIGGER user_update
BEFORE UPDATE ON user
FOR EACH ROW
    BEGIN
        SET new.u_date = NOW(6);
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER work_create
BEFORE INSERT ON work
FOR EACH ROW
    BEGIN
        SET new.c_date = NOW(6);
        SET new.u_date = NOW(6);
        SET new.example = (
            SELECT CONCAT(
                IF(new.in_use=1, '', '['),
                IF(author.in_use=1, '', '['),
                UPPER(IF(new.author_display IS NULL OR new.author_display = '', author.abbr, new.author_display)),
                IF(author.in_use=1, '', ']'),
                IF(new.abbr IS NULL,'',CONCAT(' ', new.abbr)),
                IF(new.citation IS NULL, '', CONCAT(' ', new.citation)),
                IF(new.is_maior=1, '', CONCAT(' (', IF(new.bibliography IS NULL, '', new.bibliography), ' ', IF(new.bibliography_cit IS NULL, '', new.bibliography_cit),')')),
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
        SET new.u_date = NOW(6);
        SET new.example = (
            SELECT CONCAT(
                IF(new.in_use=1, '', '['),
                IF(author.in_use=1, '', '['),
                UPPER(IF(new.author_display IS NULL OR new.author_display = '', author.abbr, new.author_display)),
                IF(author.in_use=1, '', ']'),
                IF(new.abbr IS NULL,'',CONCAT(' ', new.abbr)),
                IF(new.citation IS NULL, '', CONCAT(' ', new.citation)),
                IF(new.is_maior=1, '', CONCAT(' (', IF(new.bibliography IS NULL, '', new.bibliography), ' ', IF(new.bibliography_cit IS NULL, '', new.bibliography_cit),')')),
                IF(new.in_use=1, '', ']')
            ) FROM author WHERE new.author_id = author.id
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
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER zettel_create
BEFORE INSERT ON zettel
FOR EACH ROW
    BEGIN
        SET new.c_date = NOW(6);
        SET new.u_date = NOW(6);
        SET new.img_path = CONCAT('/zettel/',
            new.letter, '/',
            new.img_folder, '/',
            IF(new.sibling IS NULL OR new.sibling = 0, new.id, new.sibling));
        IF new.lemma_id IS NOT NULL THEN
            SET new.lemma = (SELECT lemma FROM lemma WHERE new.lemma_id = lemma.id);
            SET new.lemma_nr = (SELECT lemma_nr FROM lemma WHERE new.lemma_id = lemma.id);
            SET new.lemma_search = (SELECT lemma_search FROM lemma WHERE new.lemma_id = lemma.id);
            SET new.lemma_display = (SELECT lemma_display FROM lemma WHERE new.lemma_id = lemma.id);
        END IF;
        IF new.work_id IS NOT NULL THEN
            SET new.example = (SELECT work.example FROM work WHERE new.work_id = work.id);
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
        SET new.u_date = NOW(6);
        IF new.lemma_id != old.lemma_id OR (old.lemma_id IS NULL AND new.lemma_id IS NOT NULL) THEN
            SET new.lemma = (SELECT lemma FROM lemma WHERE new.lemma_id = lemma.id);
            SET new.lemma_nr = (SELECT lemma_nr FROM lemma WHERE new.lemma_id = lemma.id);
            SET new.lemma_search = (SELECT lemma_search FROM lemma WHERE new.lemma_id = lemma.id);
            SET new.lemma_display = (SELECT lemma_display FROM lemma WHERE new.lemma_id = lemma.id);
        END IF;
        IF new.work_id != old.work_id OR (old.work_id IS NULL AND new.work_id IS NOT NULL) THEN
            SET new.example = (SELECT work.example FROM work WHERE new.work_id = work.id);
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
        UPDATE zettel_lnk
        SET
            zettel_lnk.date_sort = new.date_sort,
            zettel_lnk.date_type = new.date_type,
            zettel_lnk.lemma_search = new.lemma_search,
            zettel_lnk.lemma_nr = new.lemma_nr,
            zettel_lnk.opus = new.opus,
            zettel_lnk.stellenangabe = new.stellenangabe,
            zettel_lnk.type = new.type
        WHERE zettel_lnk.zettel_id = new.id;
    END; //
DELIMITER ;

/* ***************************************************** */

DELIMITER //
CREATE OR REPLACE TRIGGER zettel_lnk_create
BEFORE INSERT ON zettel_lnk
FOR EACH ROW
    BEGIN
        SET new.c_date = NOW(6);
        SET new.u_date = NOW(6);
        SET new.date_sort = (SELECT zettel.date_sort FROM zettel WHERE new.zettel_id = zettel.id);
        SET new.date_type = (SELECT zettel.date_type FROM zettel WHERE new.zettel_id = zettel.id);
        SET new.lemma_search = (SELECT zettel.lemma_search FROM zettel WHERE new.zettel_id = zettel.id);
        SET new.lemma_nr = (SELECT zettel.lemma_nr FROM zettel WHERE new.zettel_id = zettel.id);
        SET new.opus = (SELECT zettel.opus FROM zettel WHERE new.zettel_id = zettel.id);
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
        SET new.u_date = NOW(6);
    END; //
DELIMITER ;
