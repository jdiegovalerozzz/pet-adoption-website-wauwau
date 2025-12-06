-- Migration: add precio (numeric) and imagen_url (varchar) to producto
-- WARNING: Make a backup before running this migration.
BEGIN;

ALTER TABLE producto
  ADD COLUMN precio numeric(10,2),
  ADD COLUMN imagen_url varchar(255);

COMMIT;
