DELIMITER //
CREATE OR REPLACE PROCEDURE updateStatistics ()
BEGIN
    DECLARE data JSON;
    DECLARE current_year INT DEFAULT LEFT(NOW(), 4);

    CREATE OR REPLACE TABLE statistics (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) UNIQUE, data JSON);
    SET data = JSON_ARRAY(NOW());
    INSERT INTO statistics (name, data) VALUES ("last_updated", data);
    /*   zettel   */
        /*   process of work  */
        SET data = JSON_ARRAY(
            (SELECT COUNT(*) FROM zettel WHERE lemma_id IS NOT NULL AND (work_id IS NOT NULL OR type = 4 OR type = 6 OR type = 7)),
            (SELECT COUNT(*) FROM zettel WHERE lemma_id IS NOT NULL AND (!(work_id IS NOT NULL OR type = 4 OR type = 6 OR type = 7) OR (work_id IS NULL AND type IS NULL))),
            (SELECT COUNT(*) FROM zettel WHERE lemma_id IS NULL)
        );
        INSERT INTO statistics (name, data) VALUES ("zettel_process", data);

        /*   type   */
        SET data = JSON_ARRAY(
            (SELECT COUNT(*) FROM zettel WHERE type=1), /* verzettelt */
            (SELECT COUNT(*) FROM zettel WHERE type=2), /* exzerpt */
            (SELECT COUNT(*) FROM zettel WHERE type=3), /* index */
            (SELECT COUNT(*) FROM zettel WHERE type=4), /* literatur */
            (SELECT COUNT(*) FROM zettel WHERE type=6), /* index (unklar) */
            (SELECT COUNT(*) FROM zettel WHERE type=7), /* notiz */
            (SELECT COUNT(*) FROM zettel WHERE type=5 OR type IS NULL)
        );
        INSERT INTO statistics (name, data) VALUES ("zettel_type", data);

        /*   created in year   */
        SET data = JSON_ARRAY(
            (SELECT COUNT(*) FROM zettel WHERE LEFT(c_date, 4)=2020),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(c_date, 4)=2021),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(c_date, 4)=2022)
        );
        INSERT INTO statistics (name, data) VALUES ("zettel_created", data);

        /*   changed in year   */
        SET data = JSON_ARRAY(
            (SELECT COUNT(*) FROM zettel WHERE LEFT(u_date, 4)=2020),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(u_date, 4)=2021),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(u_date, 4)=2022)
        );
        INSERT INTO statistics (name, data) VALUES ("zettel_changed", data);

        /* created current year */
        SET data = JSON_ARRAY(
            (SELECT COUNT(*) FROM zettel WHERE LEFT(c_date, 4)=current_year AND MID(c_date, 6, 2)="01"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(c_date, 4)=current_year AND MID(c_date, 6, 2)="02"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(c_date, 4)=current_year AND MID(c_date, 6, 2)="03"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(c_date, 4)=current_year AND MID(c_date, 6, 2)="04"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(c_date, 4)=current_year AND MID(c_date, 6, 2)="05"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(c_date, 4)=current_year AND MID(c_date, 6, 2)="06"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(c_date, 4)=current_year AND MID(c_date, 6, 2)="07"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(c_date, 4)=current_year AND MID(c_date, 6, 2)="08"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(c_date, 4)=current_year AND MID(c_date, 6, 2)="09"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(c_date, 4)=current_year AND MID(c_date, 6, 2)="10"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(c_date, 4)=current_year AND MID(c_date, 6, 2)="11"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(c_date, 4)=current_year AND MID(c_date, 6, 2)="12")
        );
        INSERT INTO statistics (name, data) VALUES ("zettel_created_current", data);

        /* changed current year */
        SET data = JSON_ARRAY(
            (SELECT COUNT(*) FROM zettel WHERE LEFT(u_date, 4)=current_year AND MID(u_date, 6, 2)="01"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(u_date, 4)=current_year AND MID(u_date, 6, 2)="02"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(u_date, 4)=current_year AND MID(u_date, 6, 2)="03"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(u_date, 4)=current_year AND MID(u_date, 6, 2)="04"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(u_date, 4)=current_year AND MID(u_date, 6, 2)="05"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(u_date, 4)=current_year AND MID(u_date, 6, 2)="06"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(u_date, 4)=current_year AND MID(u_date, 6, 2)="07"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(u_date, 4)=current_year AND MID(u_date, 6, 2)="08"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(u_date, 4)=current_year AND MID(u_date, 6, 2)="09"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(u_date, 4)=current_year AND MID(u_date, 6, 2)="10"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(u_date, 4)=current_year AND MID(u_date, 6, 2)="11"),
            (SELECT COUNT(*) FROM zettel WHERE LEFT(u_date, 4)=current_year AND MID(u_date, 6, 2)="12")
        );
        INSERT INTO statistics (name, data) VALUES ("zettel_changed_current", data);

        /*   letters   */
            SET data = JSON_ARRAY(
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="a"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="b"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="c"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="d"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="e"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="f"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="g"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="h"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="i"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="k"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="l"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="m"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="n"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="o"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="p"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="q"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="r"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="s"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="t"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="u"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="v"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="x"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="y"),
                (SELECT COUNT(*) FROM zettel WHERE LEFT(lemma, 1)="z")
            );
            INSERT INTO statistics (name, data) VALUES ("zettel_letter", data);
    
    /*   lemma   */
        /*   letters   */
            SET data = JSON_ARRAY(
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="a"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="b"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="c"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="d"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="e"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="f"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="g"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="h"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="i"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="k"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="l"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="m"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="n"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="o"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="p"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="q"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="r"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="s"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="t"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="u"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="v"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="x"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="y"),
                (SELECT COUNT(*) FROM lemma WHERE LEFT(lemma, 1)="z")
            );
            INSERT INTO statistics (name, data) VALUES ("lemma_letter", data);

        /*   mlw lemma   */
            SET data = JSON_ARRAY(
                (SELECT COUNT(*) FROM lemma WHERE MLW=1),
                (SELECT COUNT(*) FROM lemma WHERE MLW!=1 OR MLW IS NULL)
            );
            INSERT INTO statistics (name, data) VALUES ("lemma_mlw", data);
    
    /*   ressources   */
        /*   works with edition   */
            UPDATE edition SET text_ok = NULL;
            UPDATE edition LEFT JOIN scan_lnk ON scan_lnk.edition_id = edition.id SET text_ok = 1 WHERE scan_lnk.full_text IS NOT NULL OR scan_lnk.full_text != "";
            SET data = JSON_ARRAY(
                (SELECT COUNT(*) FROM work WHERE work.in_use = 1 AND (SELECT COUNT(*) FROM edition WHERE edition.work_id = work.id AND edition.text_ok =1 AND (edition.ressource = 0 OR edition.ressource = 3)) > 0),
                (SELECT COUNT(*) FROM work WHERE work.in_use = 1 AND (SELECT COUNT(*) FROM edition WHERE edition.work_id = work.id AND edition.text_ok IS NULL AND (edition.ressource = 0 OR edition.ressource = 3)) > 0),
                (SELECT COUNT(*) FROM work WHERE work.in_use = 1 AND (SELECT COUNT(*) FROM edition WHERE edition.work_id = work.id AND (edition.ressource = 0 OR edition.ressource = 3)) = 0),
                (SELECT COUNT(*) FROM work WHERE work.in_use = 0 OR work.in_use IS NULL)
            );
            INSERT INTO statistics (name, data) VALUES ("ressource_work", data);
END; //
DELIMITER ;
CALL updateStatistics();
SELECT * FROM statistics;