CREATE OR REPLACE VIEW scan_paths AS
	SELECT id, path, COUNT(id) AS count FROM scan GROUP BY path
;