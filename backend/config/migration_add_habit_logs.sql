-- ============================================================
-- Migration: Add Habit_Logs table
-- This table stores daily habit tracking data for users.
-- ============================================================

USE nutrilearn_db;

CREATE TABLE IF NOT EXISTS Habit_Logs (
    log_id         INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id        INT UNSIGNED     NOT NULL,
    water_intake   BOOLEAN          NOT NULL DEFAULT FALSE,
    fruits_eaten   BOOLEAN          NOT NULL DEFAULT FALSE,
    exercise_done  BOOLEAN          NOT NULL DEFAULT FALSE,
    log_date       DATE             NOT NULL,
    created_at     DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (log_id),
    UNIQUE KEY uq_user_date (user_id, log_date),
    CONSTRAINT fk_habit_logs_user FOREIGN KEY (user_id)
        REFERENCES Users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
