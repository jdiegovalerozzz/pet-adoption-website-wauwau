-- Migration: change mascota.edad from integer to varchar(20)
-- WARNING: Make a backup before running this migration.
BEGIN;

-- Optional: inspect current data
-- SELECT id_mascota, edad FROM mascota LIMIT 20;

ALTER TABLE mascota
  ALTER COLUMN edad TYPE varchar(20) USING edad::varchar;

COMMIT;
