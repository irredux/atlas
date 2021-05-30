DELIMITER //
DROP PROCEDURE IF EXISTS update_library;
CREATE PROCEDURE update_library ()
    BEGIN
        UPDATE work
        SET work.editions = NULL;
        UPDATE work
        SET work.editions = 
            CONCAT('[',
                (SELECT GROUP_CONCAT(
                    CONCAT('{',
                        '"id": "', e.id,
                        '", "url": "', IF(e.url IS NULL OR e.url = '', CONCAT('/site/viewer/', e.id), e.url),
                        '", "label": "', IF(CONCAT(e.editor, ' ', e.year) != ' ', 
                            IF(e.volume IS NOT NULL,CONCAT(e.editor, ' ', e.year, ' ', e.volume),CONCAT(e.editor, ' ', e.year)) , IF(e.url IS NULL, 'Digitalisat', 'Link')),
                        '"}')
                SEPARATOR ',') FROM edition e WHERE e.work_id = work.id),
                ']')
        ;


    END;
//

DELIMITER ;
