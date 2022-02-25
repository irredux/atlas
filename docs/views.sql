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