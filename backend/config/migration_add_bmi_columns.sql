-- Migration: Add BMI columns to Users table
USE healthingo_db;

ALTER TABLE Users
  ADD COLUMN IF NOT EXISTS latest_bmi DECIMAL(4,1) NULL AFTER weight_kg,
  ADD COLUMN IF NOT EXISTS bmi_category VARCHAR(20) NULL AFTER latest_bmi,
  ADD COLUMN IF NOT EXISTS bmi_calculated_at DATETIME NULL AFTER bmi_category;
