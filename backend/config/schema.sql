-- ============================================================
--  NutriLearn Platform — MySQL Database Schema
--  Database: nutrilearn_db
--  Compatible with: MySQL 8.0+ / MySQL Workbench
-- ============================================================

CREATE DATABASE IF NOT EXISTS nutrilearn_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE nutrilearn_db;

-- ============================================================
-- 1. USERS
-- Stores all registered users of the platform.
-- ============================================================
CREATE TABLE IF NOT EXISTS Users (
    user_id       INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    name          VARCHAR(100)     NOT NULL,
    email         VARCHAR(150)     NOT NULL UNIQUE,
    password_hash VARCHAR(255)     NOT NULL,
    age           TINYINT UNSIGNED DEFAULT NULL,
    height_cm     DECIMAL(5,2)     DEFAULT NULL COMMENT 'Height in centimetres',
    weight_kg     DECIMAL(5,2)     DEFAULT NULL COMMENT 'Weight in kilograms',
    gender        ENUM('male','female','other','prefer_not_to_say') DEFAULT NULL,
    health_goal   VARCHAR(200)     DEFAULT NULL,
    role          ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    avatar_url    VARCHAR(500)     DEFAULT NULL,
    is_active     BOOLEAN          NOT NULL DEFAULT TRUE,
    created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- 2. MODULES
-- Top-level learning modules (e.g., "Macronutrients", "Vitamins").
-- ============================================================
CREATE TABLE IF NOT EXISTS Modules (
    module_id     INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    title         VARCHAR(200)     NOT NULL,
    description   TEXT             DEFAULT NULL,
    icon          VARCHAR(50)      DEFAULT NULL COMMENT 'Emoji or icon identifier shown on the module card',
    thumbnail_url VARCHAR(500)     DEFAULT NULL,
    module_order  INT UNSIGNED     NOT NULL DEFAULT 1 COMMENT 'Display/unlock order of modules',
    is_published  BOOLEAN          NOT NULL DEFAULT FALSE,
    created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (module_id),
    UNIQUE KEY uq_module_order (module_order)
) ENGINE=InnoDB;

-- ============================================================
-- 3. LESSONS
-- Individual lessons that belong to a module.
-- lesson_order drives sequential unlocking within a module.
-- ============================================================
CREATE TABLE IF NOT EXISTS Lessons (
    lesson_id      INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    module_id      INT UNSIGNED     NOT NULL,
    title          VARCHAR(200)     NOT NULL,
    content        LONGTEXT         DEFAULT NULL COMMENT 'Rich text / HTML lesson content',
    video_url      VARCHAR(500)     DEFAULT NULL,
    duration_mins  SMALLINT UNSIGNED DEFAULT 0 COMMENT 'Estimated reading/watch time in minutes',
    lesson_order   INT UNSIGNED     NOT NULL COMMENT 'Sequential order within the module; drives unlock logic',
    is_published   BOOLEAN          NOT NULL DEFAULT FALSE,
    created_at     DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (lesson_id),
    UNIQUE KEY uq_lesson_order_per_module (module_id, lesson_order),
    CONSTRAINT fk_lessons_module FOREIGN KEY (module_id)
        REFERENCES Modules (module_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 4. QUIZZES
-- Each quiz is linked to a lesson and tests comprehension.
-- ============================================================
CREATE TABLE IF NOT EXISTS Quizzes (
    quiz_id       INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    lesson_id     INT UNSIGNED     NOT NULL,
    title         VARCHAR(200)     NOT NULL,
    pass_score    TINYINT UNSIGNED NOT NULL DEFAULT 70 COMMENT 'Minimum % score to pass (0-100)',
    time_limit    SMALLINT UNSIGNED DEFAULT NULL COMMENT 'Time limit in minutes; NULL = unlimited',
    is_published  BOOLEAN          NOT NULL DEFAULT FALSE,
    created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (quiz_id),
    CONSTRAINT fk_quizzes_lesson FOREIGN KEY (lesson_id)
        REFERENCES Lessons (lesson_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 5. QUIZ_QUESTIONS
-- Individual questions belonging to a quiz.
-- ============================================================
CREATE TABLE IF NOT EXISTS Quiz_Questions (
    question_id      INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    quiz_id          INT UNSIGNED  NOT NULL,
    question_text    TEXT          NOT NULL,
    question_type    ENUM('mcq', 'true_false', 'short_answer') NOT NULL DEFAULT 'mcq',
    option_a         VARCHAR(300)  DEFAULT NULL,
    option_b         VARCHAR(300)  DEFAULT NULL,
    option_c         VARCHAR(300)  DEFAULT NULL,
    option_d         VARCHAR(300)  DEFAULT NULL,
    correct_answer   VARCHAR(300)  NOT NULL COMMENT 'Correct option value or expected short answer',
    explanation      TEXT          DEFAULT NULL COMMENT 'Shown after answering to explain the correct answer',
    question_order   INT UNSIGNED  NOT NULL DEFAULT 1,
    points           TINYINT UNSIGNED NOT NULL DEFAULT 1,
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (question_id),
    CONSTRAINT fk_questions_quiz FOREIGN KEY (quiz_id)
        REFERENCES Quizzes (quiz_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 6. QUIZ_ATTEMPTS
-- Records each time a user attempts a quiz.
-- Multiple attempts per user per quiz are allowed.
-- ============================================================
CREATE TABLE IF NOT EXISTS Quiz_Attempts (
    attempt_id    INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id       INT UNSIGNED     NOT NULL,
    quiz_id       INT UNSIGNED     NOT NULL,
    score         DECIMAL(5, 2)    NOT NULL DEFAULT 0.00 COMMENT 'Percentage score (0.00 – 100.00)',
    passed        BOOLEAN          NOT NULL DEFAULT FALSE,
    answers_json  JSON             DEFAULT NULL COMMENT 'Snapshot of user answers: {question_id: chosen_answer}',
    started_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at  DATETIME         DEFAULT NULL,
    PRIMARY KEY (attempt_id),
    CONSTRAINT fk_attempts_user FOREIGN KEY (user_id)
        REFERENCES Users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_attempts_quiz FOREIGN KEY (quiz_id)
        REFERENCES Quizzes (quiz_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 7. USER_PROGRESS
-- Tracks unlock status, completion, and score per lesson per user.
-- status flow: locked → unlocked → completed
-- ============================================================
CREATE TABLE IF NOT EXISTS User_Progress (
    progress_id   INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id       INT UNSIGNED     NOT NULL,
    lesson_id     INT UNSIGNED     NOT NULL,
    status        ENUM('locked', 'unlocked', 'completed') NOT NULL DEFAULT 'locked',
    score         DECIMAL(5, 2)    DEFAULT NULL COMMENT 'Best quiz score achieved for this lesson (0.00 – 100.00)',
    completed_at  DATETIME         DEFAULT NULL COMMENT 'Timestamp when status changed to completed',
    created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (progress_id),
    UNIQUE KEY uq_user_lesson (user_id, lesson_id),
    CONSTRAINT fk_progress_user FOREIGN KEY (user_id)
        REFERENCES Users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id)
        REFERENCES Lessons (lesson_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 8. HABITS
-- Daily habits/goals that users can track (e.g., drink 2L water).
-- ============================================================
CREATE TABLE IF NOT EXISTS Habits (
    habit_id      INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id       INT UNSIGNED     NOT NULL,
    title         VARCHAR(200)     NOT NULL,
    description   VARCHAR(500)     DEFAULT NULL,
    frequency     ENUM('daily', 'weekly') NOT NULL DEFAULT 'daily',
    target_value  SMALLINT UNSIGNED DEFAULT 1 COMMENT 'e.g., 8 glasses of water per day',
    unit          VARCHAR(50)      DEFAULT NULL COMMENT 'e.g., glasses, minutes, servings',
    is_active     BOOLEAN          NOT NULL DEFAULT TRUE,
    created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (habit_id),
    CONSTRAINT fk_habits_user FOREIGN KEY (user_id)
        REFERENCES Users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 9. BADGES
-- Achievement badges that can be awarded to users.
-- ============================================================
CREATE TABLE IF NOT EXISTS Badges (
    badge_id      INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    name          VARCHAR(100)     NOT NULL UNIQUE,
    description   VARCHAR(300)     DEFAULT NULL,
    icon_url      VARCHAR(500)     DEFAULT NULL,
    criteria_type ENUM('lesson_complete', 'quiz_pass', 'streak', 'habit', 'module_complete')
                                   NOT NULL COMMENT 'What action triggers this badge',
    criteria_value INT UNSIGNED    DEFAULT NULL COMMENT 'Threshold value (e.g., 7 for a 7-day streak)',
    created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (badge_id)
) ENGINE=InnoDB;

-- ─── Junction table: which badges a user has earned ──────────────────────────
CREATE TABLE IF NOT EXISTS User_Badges (
    user_badge_id INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id       INT UNSIGNED     NOT NULL,
    badge_id      INT UNSIGNED     NOT NULL,
    awarded_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_badge_id),
    UNIQUE KEY uq_user_badge (user_id, badge_id),
    CONSTRAINT fk_ubadges_user  FOREIGN KEY (user_id)  REFERENCES Users  (user_id)  ON DELETE CASCADE,
    CONSTRAINT fk_ubadges_badge FOREIGN KEY (badge_id) REFERENCES Badges (badge_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 10. STREAKS
-- Tracks daily learning streaks per user.
-- ============================================================
CREATE TABLE IF NOT EXISTS Streaks (
    streak_id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    user_id           INT UNSIGNED  NOT NULL UNIQUE COMMENT 'One streak record per user',
    current_streak    INT UNSIGNED  NOT NULL DEFAULT 0 COMMENT 'Consecutive days active',
    longest_streak    INT UNSIGNED  NOT NULL DEFAULT 0 COMMENT 'All-time best streak',
    last_activity_date DATE         DEFAULT NULL COMMENT 'Date of the user''s most recent learning activity',
    created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (streak_id),
    CONSTRAINT fk_streaks_user FOREIGN KEY (user_id)
        REFERENCES Users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- INDEXES for commonly queried columns
-- ============================================================
CREATE INDEX idx_lessons_module    ON Lessons       (module_id, lesson_order);
CREATE INDEX idx_progress_user     ON User_Progress (user_id, status);
CREATE INDEX idx_attempts_user     ON Quiz_Attempts (user_id, quiz_id);
CREATE INDEX idx_habits_user       ON Habits        (user_id, is_active);
CREATE INDEX idx_streaks_activity  ON Streaks       (last_activity_date);
