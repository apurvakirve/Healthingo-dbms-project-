-- ============================================================
-- Migration: Add points to Users table
-- ============================================================

USE nutrilearn_db;

ALTER TABLE Users ADD COLUMN points INT UNSIGNED NOT NULL DEFAULT 0 AFTER role;
