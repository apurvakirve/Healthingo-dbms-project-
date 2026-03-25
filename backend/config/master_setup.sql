-- ============================================================
--  Healthingo Portfolio Project — Master Database Setup
--  Database: healthingo_db
--  Compatible with: MySQL 8.0+ / MySQL Workbench
--  This file consolidates all schema, migrations, and seed data.
-- ============================================================

-- 1. DATABASE INITIALIZATION
-- ------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS healthingo_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE healthingo_db;

-- 2. RESET EXISTING DATA (Optional, for a clean start)
-- ------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS User_Badges;
DROP TABLE IF EXISTS Badges;
DROP TABLE IF EXISTS User_Progress;
DROP TABLE IF EXISTS Quiz_Attempts;
DROP TABLE IF EXISTS Quiz_Questions;
DROP TABLE IF EXISTS Quizzes;
DROP TABLE IF EXISTS Lessons;
DROP TABLE IF EXISTS Modules;
DROP TABLE IF EXISTS Streaks;
DROP TABLE IF EXISTS Habit_Logs;
DROP TABLE IF EXISTS Habits;
DROP TABLE IF EXISTS Custom_Habits;
DROP TABLE IF EXISTS Users;
SET FOREIGN_KEY_CHECKS = 1;

-- 3. SCHEMA DEFINITION
-- ------------------------------------------------------------

-- USERS TABLE
CREATE TABLE Users (
    user_id           INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    name              VARCHAR(100)     NOT NULL,
    email             VARCHAR(150)     NOT NULL UNIQUE,
    password_hash     VARCHAR(255)     NOT NULL,
    age               TINYINT UNSIGNED DEFAULT NULL,
    height_cm         DECIMAL(5,2)     DEFAULT NULL COMMENT 'Height in centimetres',
    weight_kg         DECIMAL(5,2)     DEFAULT NULL COMMENT 'Weight in kilograms',
    latest_bmi        DECIMAL(4,1)     DEFAULT NULL,
    bmi_category      VARCHAR(20)      DEFAULT NULL,
    bmi_calculated_at DATETIME         DEFAULT NULL,
    gender            ENUM('male','female','other','prefer_not_to_say') DEFAULT NULL,
    health_goal       VARCHAR(200)     DEFAULT NULL,
    role              ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    points            INT UNSIGNED     NOT NULL DEFAULT 0,
    avatar_url        VARCHAR(500)     DEFAULT NULL,
    is_active         BOOLEAN          NOT NULL DEFAULT TRUE,
    created_at        DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
) ENGINE=InnoDB;

-- MODULES TABLE
CREATE TABLE Modules (
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

-- LESSONS TABLE
CREATE TABLE Lessons (
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

-- QUIZZES TABLE
CREATE TABLE Quizzes (
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

-- QUIZ_QUESTIONS TABLE
CREATE TABLE Quiz_Questions (
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

-- QUIZ_ATTEMPTS TABLE
CREATE TABLE Quiz_Attempts (
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

-- USER_PROGRESS TABLE
CREATE TABLE User_Progress (
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

-- HABITS TABLE
CREATE TABLE Habits (
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

-- HABIT_LOGS TABLE
CREATE TABLE Habit_Logs (
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

-- CUSTOM_HABITS TABLE
CREATE TABLE Custom_Habits (
    habit_id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED NOT NULL,
    habit_name      VARCHAR(100) NOT NULL,
    habit_description TEXT NULL,
    frequency       ENUM('daily', 'weekly') NOT NULL DEFAULT 'daily',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_custom_habits_user FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- BADGES TABLE
CREATE TABLE Badges (
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

-- USER_BADGES TABLE
CREATE TABLE User_Badges (
    user_badge_id INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_id       INT UNSIGNED     NOT NULL,
    badge_id      INT UNSIGNED     NOT NULL,
    awarded_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_badge_id),
    UNIQUE KEY uq_user_badge (user_id, badge_id),
    CONSTRAINT fk_ubadges_user  FOREIGN KEY (user_id)  REFERENCES Users  (user_id)  ON DELETE CASCADE,
    CONSTRAINT fk_ubadges_badge FOREIGN KEY (badge_id) REFERENCES Badges (badge_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- STREAKS TABLE
CREATE TABLE Streaks (
    streak_id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    user_id           INT UNSIGNED  NOT NULL UNIQUE COMMENT 'One streak record per user',
    current_streak    INT UNSIGNED  NOT NULL DEFAULT 0 COMMENT 'Consecutive days active',
    longest_streak    INT UNSIGNED  NOT NULL DEFAULT 0 COMMENT 'All-time best streak',
    last_activity_date DATE         DEFAULT NULL COMMENT 'Date of the user\'s most recent learning activity',
    created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (streak_id),
    CONSTRAINT fk_streaks_user FOREIGN KEY (user_id)
        REFERENCES Users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- INDEXES
CREATE INDEX idx_lessons_module    ON Lessons       (module_id, lesson_order);
CREATE INDEX idx_progress_user     ON User_Progress (user_id, status);
CREATE INDEX idx_attempts_user     ON Quiz_Attempts (user_id, quiz_id);
CREATE INDEX idx_habits_user       ON Habits        (user_id, is_active);
CREATE INDEX idx_streaks_activity  ON Streaks       (last_activity_date);

-- 4. SEED DATA
-- ------------------------------------------------------------

-- A. USERS
INSERT INTO Users (user_id, name, email, password_hash, role) VALUES
(1, 'Admin Healthingo', 'admin@healthingo.com', '$2b$10$X7m/A4zGf1f2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V', 'admin'),
(2, 'Apurva Kirve', 'apurva@example.com', '$2b$10$X7m/A4zGf1f2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V', 'student'),
(3, 'John Doe', 'john@example.com', '$2b$10$X7m/A4zGf1f2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V', 'student');

-- B. MODULES
INSERT INTO Modules (module_id, title, description, module_order, is_published, icon) VALUES
(1, 'Nutrition Basics', 'Learn the fundamentals of nutrition and healthy eating', 1, TRUE, '🥗'),
(2, 'Balanced Diet', 'Discover how to create balanced meals for optimal health', 2, TRUE, '🍱'),
(3, 'Macronutrients', 'Understanding proteins, carbohydrates, and fats', 3, TRUE, '🥩'),
(4, 'Micronutrients', 'Essential vitamins and minerals for health', 4, TRUE, '💊'),
(5, 'Healthy Eating Habits', 'Build sustainable healthy eating patterns', 5, TRUE, '🧘'),
(6, 'Diet for Different Health Goals', 'Tailored nutrition for your specific goals', 6, TRUE, '🎯');

-- C. LESSONS (30 Lessons with Detailed Content)
INSERT INTO Lessons (lesson_id, module_id, title, content, duration_mins, lesson_order, is_published) VALUES
-- Module 1
(1, 1, 'What is Nutrition?', 'Nutrition is the biochemical and physiological process by which an organism uses food to support its life. It provides organisms with nutrients, which can be metabolized to create energy and chemical structures. Failure to obtain sufficient nutrients causes malnutrition. Nutritional science is the study of nutrition, though it typically emphasizes human nutrition. In humans, nutrition is a fundamental pillar of health. A well-balanced diet provides the essential vitamins, minerals, and calories needed to fuel daily activities and maintain vital organ functions. Beyond just energy, nutrition plays a critical role in cellular repair, immune system strength, and the prevention of chronic illnesses such as heart disease, diabetes, and certain types of cancer.', 5, 1, TRUE),
(2, 1, 'Importance of Balanced Diet', 'A balanced diet is one that fulfills all of a person\'s nutritional needs without going over the recommended daily calorie intake. By eating a balanced diet, people can get the nutrients and energy they need to work and enjoy life. A balanced diet typically includes a mix of five food groups: vegetables, fruits, grains, proteins, and dairy. Each group provides different essential nutrients, such as fiber, vitamins, and minerals. Balancing these groups ensures that the body receives a broad spectrum of nourishment. For instance, fruits and vegetables are rich in antioxidants, while proteins are essential for muscle repair and hormone production. Maintaining this balance is key to preventing deficiencies and supporting long-term health.', 5, 2, TRUE),
(3, 1, 'Food Groups', 'The five main food groups are the building blocks of a healthy diet. 1. Fruits: Rich in vitamins and fiber. 2. Vegetables: Provide essential minerals and antioxidants. 3. Grains: Source of energy and B-vitamins, especially whole grains. 4. Protein: Essential for growth and repair, including meat, fish, beans, and nuts. 5. Dairy: Crucial for bone health through calcium and vitamin D. Understanding these groups allows for variety in meal planning, ensuring that you don\'t rely on a single source of nutrition. Diversifying your plate not only makes meals more interesting but also guarantees a more complete intake of the micronutrients your body craves for peak performance.', 5, 3, TRUE),
(4, 1, 'Reading Nutrition Labels', 'Nutrition labels provide important information about the nutritional content of packaged foods. Learn to read serving sizes, calories, and key nutrients like fats, grains, and proteins. One key element is the % Daily Value (%DV), which tells you how much a nutrient in a serving contributes to a daily diet. Understanding these labels empowers you to make smarter choices at the grocery store, helping you avoid hidden sugars or excessive sodium. By comparing different products, you can select options that better align with your specific health goals, whether that\'s reducing calorie intake or increasing fiber.', 7, 4, TRUE),
(5, 1, 'Portion Control', 'Portion control is the practice of understanding how much food is being consumed and ensuring it aligns with your energy needs. Effective strategies include using smaller plates, measuring servings with common objects, and being mindful of hunger cues. By mastering portions, you can enjoy a variety of foods without over-consuming calories. It\'s not just about eating less, but about eating the right amount for your body\'s requirements. Consistent portion control is one of the most effective ways to manage weight and prevent the sluggishness often associated with overeating.', 6, 5, TRUE),
-- Module 2
(6, 2, 'The Plate Method', 'The plate method is a simple and effective visual guide for creating balanced, nutritious meals. To use this method, imagine your plate is divided into sections: fill half of your plate with non-starchy vegetables like leafy greens, broccoli, or peppers. These provide volume and fiber with few calories. Divide the remaining half into two equal quarters. Fill one quarter with lean protein, such as grilled chicken, fish, tofu, or beans. Fill the final quarter with whole grains or starchy vegetables like brown rice, quinoa, or sweet potatoes. This proportion naturally manages calorie intake while ensuring a spectrum of macronutrients and micronutrients at every meal.', 5, 1, TRUE),
(7, 2, 'Meal Planning Basics', 'Effective meal planning is a cornerstone of a healthy lifestyle. It involves thinking ahead about what you will eat for the week, which helps avoid impulsive, less nutritious choices when you are hungry or busy. Start by auditing your pantry, choosing a few recipes, and creating a structured shopping list. Batch cooking—preparing larger quantities of grains, proteins, or veggies on the weekend—can save hours during the work week. Meal planning not only supports your nutritional goals but also reduces food waste and can significantly lower your grocery bills over time. Consistency is more important than perfection; start with planning just two or three dinners a week and build from there.', 8, 2, TRUE),
(8, 2, 'Healthy Snacking', 'Snacks can be part of a healthy diet when chosen wisely. Opt for nutrient-dense options like fruits, vegetables with hummus, nuts, or yogurt instead of processed snacks. Smart snacking helps maintain energy levels between meals and prevents overeating during main meal times. Think of snacks as "mini-meals" that bridge the gap, providing an extra opportunity to fit in fiber and protein. Avoid snacking directly from large bags; instead, portion out your snacks to avoid mindless overconsumption.', 5, 3, TRUE),
(9, 2, 'Eating Out Smartly', 'Learn strategies for making healthy choices when dining out. Tips include checking nutrition information beforehand, choosing grilled over fried options, and being mindful of portion sizes. You can also ask for dressings on the side and share large portions with friends to manage calorie intake. Many restaurants now offer "lighter options" or allow for easy substitutions, like swapping fries for a side salad. Being proactive about your choices ensures that a social outing doesn\'t derail your nutritional progress.', 7, 4, TRUE),
(10, 2, 'Budget-Friendly Nutrition', 'Eating healthy does not have to be expensive. Learn to choose affordable nutritious foods like beans, lentils, and seasonal produce. Shopping seasonally, minimizing food waste, and cooking at home more often can significantly lower your grocery bills while still supporting your nutritional goals. Often, frozen or canned vegetables (with no added salt) are just as nutritious as fresh ones and are much more budget-friendly. Planning meals around sales and buying in bulk for staples like rice and oats are other great ways to save.', 6, 5, TRUE),
-- Module 3 (Abbreviated content for brevity in this consolidated file, can be expanded)
(11, 3, 'Introduction to Macronutrients', 'Macronutrients are nutrients that provide energy and are needed in large amounts: carbohydrates, proteins, and fats.', 5, 1, TRUE),
(12, 3, 'Carbohydrates: Your Body\'s Fuel', 'Carbohydrates are the body\'s primary energy source. Learn about simple vs. complex carbs and the importance of fiber.', 8, 2, TRUE),
(13, 3, 'Proteins: Building Blocks', 'Proteins are essential for building and repairing tissues, making enzymes and hormones.', 7, 3, TRUE),
(14, 3, 'Fats: The Good and The Bad', 'Not all fats are created equal. Learn to distinguish between healthy unsaturated fats and less healthy saturated/trans fats.', 8, 4, TRUE),
(15, 3, 'Balancing Your Macros', 'Learn how to balance your macronutrient intake based on your health goals and activity level.', 6, 5, TRUE),
-- Module 4
(16, 4, 'What are Micronutrients?', 'Micronutrients are vitamins and minerals needed in small amounts but essential for proper body function.', 4, 1, TRUE),
(17, 4, 'Essential Vitamins', 'Learn about fat-soluble (A, D, E, K) and water-soluble (B, C) vitamins, their functions, and sources.', 8, 2, TRUE),
(18, 4, 'Important Minerals', 'Discover essential minerals like calcium, iron, zinc, and magnesium. Understand their roles in the body.', 7, 3, TRUE),
(19, 4, 'Antioxidants', 'Learn about antioxidants and their role in protecting cells from damage. Discover the best food sources.', 6, 4, TRUE),
(20, 4, 'Supplements: When Needed', 'Understand when supplementation might be necessary and how to choose quality supplements safely.', 6, 5, TRUE),
-- Module 5
(21, 5, 'Mindful Eating', 'Mindful eating involves paying full attention to the eating experience. Learn to recognize hunger and fullness cues.', 6, 1, TRUE),
(22, 5, 'Hydration Matters', 'Water is essential for every body function. Learn how much water you need and signs of dehydration.', 5, 2, TRUE),
(23, 5, 'Regular Meal Times', 'Eating at regular intervals helps maintain energy levels and prevents overeating.', 5, 3, TRUE),
(24, 5, 'Managing Cravings', 'Understand why cravings occur and learn healthy strategies to manage them effectively.', 7, 4, TRUE),
(25, 5, 'Building Lasting Habits', 'Learn how to create sustainable healthy eating habits through small, consistent changes.', 8, 5, TRUE),
-- Module 6
(26, 6, 'Nutrition for Weight Loss', 'Learn sustainable approaches to weight loss through balanced nutrition and calorie management.', 8, 1, TRUE),
(27, 6, 'Nutrition for Weight Gain', 'Discover how to gain weight healthily through nutrient-dense foods and appropriate calorie surplus.', 7, 2, TRUE),
(28, 6, 'Nutrition for Muscle Building', 'Learn optimal protein intake and timing strategies for muscle growth and recovery.', 8, 3, TRUE),
(29, 6, 'Sports Nutrition', 'Discover how to fuel athletic performance with pre, during, and post-workout nutrition.', 8, 4, TRUE),
(30, 6, 'Nutrition for Longevity', 'Learn about dietary patterns associated with longevity, like the Mediterranean diet.', 7, 5, TRUE);

-- D. QUIZZES
INSERT INTO Quizzes (quiz_id, lesson_id, title, pass_score, is_published) VALUES
(1, 1, 'Nutrition Basics Mastery', 80, TRUE),
(2, 2, 'Balanced Diet Essentials', 80, TRUE),
(3, 11, 'Macronutrient Fundamentals', 75, TRUE),
(4, 16, 'Micronutrient Quiz', 75, TRUE),
(5, 21, 'Habits & Hydration', 80, TRUE),
(6, 26, 'Health Goals Check', 80, TRUE);

-- E. QUESTIONS
INSERT INTO Quiz_Questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(1, 'What is the body\'s process of obtaining and using food called?', 'Digestion', 'Nutrition', 'Metabolism', 'Ingestion', 'Nutrition', 'Nutrition is the cumulative process of obtaining and using nutrients.'),
(1, 'Which of these is NOT a primary reason for good nutrition?', 'Growth', 'Repair', 'Tanning', 'Metabolism', 'Tanning', 'Good nutrition is essential for growth, metabolism, and repair.'),
(1, 'A healthy diet helps reduce the risk of what?', 'Height growth', 'Chronic diseases', 'Hair color change', 'Sleep cycles', 'Chronic diseases', 'Proper nutrition is a key factor in preventing long-term illnesses.'),
(1, 'Balanced nutrition promotes overall:', 'Wealth', 'Well-being', 'Popularity', 'Memory', 'Well-being', 'It supports physical and mental health.'),
(2, 'What does a balanced diet provide to the body?', 'Only water', 'All essential nutrients', 'Only protein', 'Excess sugar', 'All essential nutrients', 'A balanced diet ensures all nutrient requirements are met.'),
(2, 'Balanced diets help maintain what levels?', 'Energy', 'Stress', 'Noise', 'Volume', 'Energy', 'Stable energy levels are a key benefit of a balanced diet.'),
(2, 'Which function does a balanced diet NOT typically support?', 'Immune function', 'Healthy growth', 'X-ray vision', 'Metabolic rate', 'X-ray vision', 'Immune health and growth represent standard physiological benefits.');

-- F. HABITS
INSERT INTO Habits (user_id, title, description, frequency, target_value, unit) VALUES
(2, 'Drink Water', 'Drink at least 8 glasses of water daily', 'daily', 8, 'glasses'),
(2, 'Eat Fruits & Veggies', '5 servings of fruits and vegetables', 'daily', 5, 'servings'),
(2, 'Daily Exercise', '30 minutes of physical activity', 'daily', 30, 'minutes'),
(3, 'Drink Water', 'Hydration is key', 'daily', 6, 'glasses');

-- G. BADGES
INSERT INTO Badges (badge_id, name, description, criteria_type, criteria_value) VALUES
(1, 'First Lesson', 'Completed your very first lesson!', 'lesson_complete', 1),
(2, 'Quiz Master', 'Successfully passed 5 different quizzes', 'quiz_pass', 5),
(3, '7 Day Streak', 'Logged in for 7 days in a row', 'streak', 7),
(4, 'Module Complete', 'Finished all lessons in a module', 'module_complete', 1),
(5, '30 Day Streak', 'A month of consistent learning', 'streak', 30),
(10, 'Expert', 'Complete all available modules', 'module_complete', 6),
(11, 'Perfect Score', 'Scored 100% on a quiz', 'quiz_pass', 1),
(12, 'Quick Learner', '100% on first attempt of any quiz', 'quiz_pass', 1),
(13, 'Persistent Learner', 'Pass a quiz after 3+ attempts', 'quiz_pass', 1),
(14, 'Fast Learner', 'Complete 3+ lessons in a single day', 'lesson_complete', 3);

-- H. STREAKS
INSERT INTO Streaks (user_id, current_streak, longest_streak, last_activity_date) VALUES
(2, 7, 12, CURDATE()),
(3, 1, 3, CURDATE());

-- I. INITIAL USER PROGRESS (Sample for user 2)
INSERT INTO User_Progress (user_id, lesson_id, status, score, completed_at) VALUES
(2, 1, 'completed', 100.00, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 2, 'completed', 90.00, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(2, 3, 'completed', NULL, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 4, 'unlocked', NULL, NULL);

-- J. INITIAL USER BADGES (Clean Start - No badges pre-awarded)
-- INSERT INTO User_Badges (user_id, badge_id, awarded_at) VALUES
-- (2, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
-- (2, 2, DATE_SUB(NOW(), INTERVAL 5 DAY)),
-- (2, 3, NOW());

-- ============================================================
-- 11. ADMINS (Dedicated table for admin accounts)
-- ============================================================
CREATE TABLE IF NOT EXISTS Admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Admins (name, email, password_hash) VALUES
('Super Admin', 'admin@healthingo.com', 'password123');

-- END OF SCRIPT
-- ============================================================
