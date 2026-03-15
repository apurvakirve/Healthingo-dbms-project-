-- Migration: Create Custom_Habits table for user-defined habits
USE healthingo_db;

CREATE TABLE IF NOT EXISTS Custom_Habits (
  habit_id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED NOT NULL,
  habit_name      VARCHAR(100) NOT NULL,
  habit_description TEXT NULL,
  frequency       ENUM('daily', 'weekly') NOT NULL DEFAULT 'daily',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_custom_habits_user FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
