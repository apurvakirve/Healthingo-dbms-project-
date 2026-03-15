-- ============================================================
--  Migration: Add icon column to Modules table
--  Run this ONCE against an existing database.
-- ============================================================

-- Change the database name below if needed
USE healthingo_db;   -- or nutrilearn_db

ALTER TABLE Modules
  ADD COLUMN icon VARCHAR(50) DEFAULT NULL
    COMMENT 'Emoji or icon identifier shown on the module card'
    AFTER description;
