-- ============================================================
--  Migration: Add health-profile columns to Users table
--  Run this ONCE against an existing healthingo_db / nutrilearn_db
--  to bring the live schema up to date without data loss.
-- ============================================================

USE healthingo_db;   -- change to nutrilearn_db if needed

ALTER TABLE Users
  ADD COLUMN age         TINYINT UNSIGNED DEFAULT NULL             AFTER password_hash,
  ADD COLUMN height_cm   DECIMAL(5,2)     DEFAULT NULL             AFTER age,
  ADD COLUMN weight_kg   DECIMAL(5,2)     DEFAULT NULL             AFTER height_cm,
  ADD COLUMN gender      ENUM('male','female','other','prefer_not_to_say') DEFAULT NULL AFTER weight_kg,
  ADD COLUMN health_goal VARCHAR(200)     DEFAULT NULL             AFTER gender;
