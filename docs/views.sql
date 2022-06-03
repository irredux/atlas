CREATE OR REPLACE VIEW scan_paths AS
	SELECT id, path, COUNT(id) AS count FROM scan GROUP BY path
;

CREATE OR REPLACE VIEW scan_opera_view AS
	SELECT
	o.id AS id,
	s.full_text AS full_text,
	o.editions_label AS editions_label,
	o.editions_id AS editions_id,
	o.editions_url AS editions_url,
	o.editions_type AS editions_type,
	o.in_use AS in_use,
	o.citation AS citation,
	e.id AS edition_id
	FROM scan_lnk s
	LEFT JOIN edition e ON s.edition_id=e.id
	LEFT JOIN scan_opera o ON e.work_id=o.work_id
	WHERE s.full_text IS NOT NULL AND o.id IS NOT NULL
	ORDER BY o.work_id ASC
;

CREATE OR REPLACE VIEW fulltext_search_view AS
	SELECT
		s.filename AS page,
		s.full_text AS full_text,
		s.auto_text AS auto_text,
		s.scan_id AS scan_id,
		e.label AS label,
		e.id AS edition_id,
		w.ac_web AS ac_web,
		w.opus AS opus,
		w.id AS work_id
	FROM scan_lnk s
	LEFT JOIN edition e ON e.id = s.edition_id
	LEFT JOIN work w ON e.work_id = w.id
	WHERE
		w.id IS NOT NULL AND
		s.full_text IS NOT NULL AND
		s.full_text != ""
;


SHOW INDEX_STATISTICS;
CREATE INDEX IF NOT EXISTS edition_work ON edition (work_id);