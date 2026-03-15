-- ============================================================
-- NutriLearn Platform — Deeply Detailed Sample Seed Data
-- Database: nutrilearn_db
-- Based on Frontend Curriculum Analysis (src/app/data/modules.ts)
-- ============================================================

USE nutrilearn_db;

-- Clear existing data to avoid duplicates (optional, keep if you want a fresh start)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE User_Badges;
TRUNCATE TABLE Badges;
TRUNCATE TABLE User_Progress;
TRUNCATE TABLE Quiz_Attempts;
TRUNCATE TABLE Quiz_Questions;
TRUNCATE TABLE Quizzes;
TRUNCATE TABLE Lessons;
TRUNCATE TABLE Modules;
TRUNCATE TABLE Streaks;
TRUNCATE TABLE Habits;
TRUNCATE TABLE Users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS
-- Password hash for 'password123'
INSERT INTO Users (user_id, name, email, password_hash, role) VALUES
(1, 'Admin Healthingo', 'admin@healthingo.com', '$2b$10$X7m/A4zGf1f2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V', 'admin'),
(2, 'Apurva Kirve', 'apurva@example.com', '$2b$10$X7m/A4zGf1f2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V', 'student'),
(3, 'John Doe', 'john@example.com', '$2b$10$X7m/A4zGf1f2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V', 'student');

-- 2. MODULES (Mapped to src/app/data/modules.ts)
INSERT INTO Modules (module_id, title, description, module_order, is_published) VALUES
(1, 'Nutrition Basics', 'Learn the fundamentals of nutrition and healthy eating', 1, TRUE),
(2, 'Balanced Diet', 'Discover how to create balanced meals for optimal health', 2, TRUE),
(3, 'Macronutrients', 'Understanding proteins, carbohydrates, and fats', 3, TRUE),
(4, 'Micronutrients', 'Essential vitamins and minerals for health', 4, TRUE),
(5, 'Healthy Eating Habits', 'Build sustainable healthy eating patterns', 5, TRUE),
(6, 'Diet for Different Health Goals', 'Tailored nutrition for your specific goals', 6, TRUE);

-- 3. LESSONS (30 Lessons Total)
-- Module 1: Nutrition Basics
INSERT INTO Lessons (lesson_id, module_id, title, content, duration_mins, lesson_order, is_published) VALUES
(1, 1, 'What is Nutrition?', 'Nutrition is the process by which our bodies obtain and use food for growth, metabolism, and repair. Understanding nutrition is the foundation of making healthy dietary choices. Good nutrition helps maintain a healthy weight, reduces disease risk, and promotes overall well-being.', 5, 1, TRUE),
(2, 1, 'Importance of Balanced Diet', 'A balanced diet provides your body with all the essential nutrients it needs to function correctly. It includes a variety of foods from all food groups in the right proportions. A balanced diet helps maintain energy levels, supports immune function, and promotes healthy growth.', 5, 2, TRUE),
(3, 1, 'Food Groups', 'The main food groups include fruits, vegetables, grains, proteins, and dairy. Each group provides different essential nutrients. Eating a variety from each group ensures you get all the nutrients your body needs.', 5, 3, TRUE),
(4, 1, 'Reading Nutrition Labels', 'Nutrition labels provide important information about the nutritional content of packaged foods. Learn to read serving sizes, calories, and key nutrients to make informed food choices.', 7, 4, TRUE),
(5, 1, 'Portion Control', 'Understanding appropriate portion sizes is crucial for maintaining a healthy diet. Portion control helps manage calorie intake and ensures balanced nutrition without overeating.', 6, 5, TRUE);

-- Module 2: Balanced Diet
INSERT INTO Lessons (lesson_id, module_id, title, content, duration_mins, lesson_order, is_published) VALUES
(6, 2, 'The Plate Method', 'The plate method is a simple way to create balanced meals. Fill half your plate with vegetables and fruits, one quarter with lean protein, and one quarter with whole grains.', 5, 1, TRUE),
(7, 2, 'Meal Planning Basics', 'Effective meal planning saves time, money, and helps maintain a healthy diet. Learn to plan weekly menus and prepare shopping lists.', 8, 2, TRUE),
(8, 2, 'Healthy Snacking', 'Snacks can be part of a healthy diet when chosen wisely. Opt for nutrient-dense options like fruits, vegetables with hummus, or yogurt.', 5, 3, TRUE),
(9, 2, 'Eating Out Smartly', 'Learn strategies for making healthy choices when dining out. Tips include checking nutrition info and choosing grilled over fried.', 7, 4, TRUE),
(10, 2, 'Budget-Friendly Nutrition', 'Eating healthy doesn\'t have to be expensive. Learn to choose affordable nutritious foods and shop seasonally.', 6, 5, TRUE);

-- Module 3: Macronutrients
INSERT INTO Lessons (lesson_id, module_id, title, content, duration_mins, lesson_order, is_published) VALUES
(11, 3, 'Introduction to Macronutrients', 'Macronutrients are nutrients that provide energy and are needed in large amounts: carbohydrates, proteins, and fats.', 5, 1, TRUE),
(12, 3, 'Carbohydrates: Your Body\'s Fuel', 'Carbohydrates are the body\'s primary energy source. Learn about simple vs. complex carbs and the importance of fiber.', 8, 2, TRUE),
(13, 3, 'Proteins: Building Blocks', 'Proteins are essential for building and repairing tissues, making enzymes and hormones.', 7, 3, TRUE),
(14, 3, 'Fats: The Good and The Bad', 'Not all fats are created equal. Learn to distinguish between healthy unsaturated fats and less healthy saturated/trans fats.', 8, 4, TRUE),
(15, 3, 'Balancing Your Macros', 'Learn how to balance your macronutrient intake based on your health goals and activity level.', 6, 5, TRUE);

-- Module 4: Micronutrients
INSERT INTO Lessons (lesson_id, module_id, title, content, duration_mins, lesson_order, is_published) VALUES
(16, 4, 'What are Micronutrients?', 'Micronutrients are vitamins and minerals needed in small amounts but essential for proper body function.', 4, 1, TRUE),
(17, 4, 'Essential Vitamins', 'Learn about fat-soluble (A, D, E, K) and water-soluble (B, C) vitamins, their functions, and sources.', 8, 2, TRUE),
(18, 4, 'Important Minerals', 'Discover essential minerals like calcium, iron, zinc, and magnesium. Understand their roles in the body.', 7, 3, TRUE),
(19, 4, 'Antioxidants', 'Learn about antioxidants and their role in protecting cells from damage. Discover the best food sources.', 6, 4, TRUE),
(20, 4, 'Supplements: When Needed', 'Understand when supplementation might be necessary and how to choose quality supplements safely.', 6, 5, TRUE);

-- Module 5: Healthy Eating Habits
INSERT INTO Lessons (lesson_id, module_id, title, content, duration_mins, lesson_order, is_published) VALUES
(21, 5, 'Mindful Eating', 'Mindful eating involves paying full attention to the eating experience. Learn to recognize hunger and fullness cues.', 6, 1, TRUE),
(22, 5, 'Hydration Matters', 'Water is essential for every body function. Learn how much water you need and signs of dehydration.', 5, 2, TRUE),
(23, 5, 'Regular Meal Times', 'Eating at regular intervals helps maintain energy levels and prevents overeating.', 5, 3, TRUE),
(24, 5, 'Managing Cravings', 'Understand why cravings occur and learn healthy strategies to manage them effectively.', 7, 4, TRUE),
(25, 5, 'Building Lasting Habits', 'Learn how to create sustainable healthy eating habits through small, consistent changes.', 8, 5, TRUE);

-- Module 6: Diet for Different Health Goals
INSERT INTO Lessons (lesson_id, module_id, title, content, duration_mins, lesson_order, is_published) VALUES
(26, 6, 'Nutrition for Weight Loss', 'Learn sustainable approaches to weight loss through balanced nutrition and calorie management.', 8, 1, TRUE),
(27, 6, 'Nutrition for Weight Gain', 'Discover how to gain weight healthily through nutrient-dense foods and appropriate calorie surplus.', 7, 2, TRUE),
(28, 6, 'Nutrition for Muscle Building', 'Learn optimal protein intake and timing strategies for muscle growth and recovery.', 8, 3, TRUE),
(29, 6, 'Sports Nutrition', 'Discover how to fuel athletic performance with pre, during, and post-workout nutrition.', 8, 4, TRUE),
(30, 6, 'Nutrition for Longevity', 'Learn about dietary patterns associated with longevity, like the Mediterranean diet.', 7, 5, TRUE);

-- 4. QUIZZES (1 per lesson for first 2 modules, 1 per module for others)
INSERT INTO Quizzes (quiz_id, lesson_id, title, pass_score, is_published) VALUES
(1, 1, 'Nutrition Basics Mastery', 80, TRUE),
(2, 2, 'Balanced Diet Essentials', 80, TRUE),
(3, 11, 'Macronutrient Fundamentals', 75, TRUE),
(4, 16, 'Micronutrient Quiz', 75, TRUE),
(5, 21, 'Habits & Hydration', 80, TRUE),
(6, 26, 'Health Goals Check', 80, TRUE);

-- 5. QUIZ_QUESTIONS (Detailed Questions)
-- Quiz 1: Nutrition Basics
INSERT INTO Quiz_Questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(1, 'What is the body\'s process of obtaining and using food called?', 'Digestion', 'Nutrition', 'Metabolism', 'Ingestion', 'Nutrition', 'Nutrition is the cumulative process of obtaining and using nutrients.'),
(1, 'Which of these is NOT a primary reason for good nutrition?', 'Growth', 'Repair', 'Tanning', 'Metabolism', 'Tanning', 'Good nutrition is essential for growth, metabolism, and repair.'),
(1, 'A healthy diet helps reduce the risk of what?', 'Height growth', 'Chronic diseases', 'Hair color change', 'Sleep cycles', 'Chronic diseases', 'Proper nutrition is a key factor in preventing long-term illnesses.'),
(1, 'Balanced nutrition promotes overall:', 'Wealth', 'Well-being', 'Popularity', 'Memory', 'Well-being', 'It supports physical and mental health.');

-- Quiz 2: Balanced Diet
INSERT INTO Quiz_Questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(2, 'What does a balanced diet provide to the body?', 'Only water', 'All essential nutrients', 'Only protein', 'Excess sugar', 'All essential nutrients', 'A balanced diet ensures all nutrient requirements are met.'),
(2, 'Balanced diets help maintain what levels?', 'Energy', 'Stress', 'Noise', 'Volume', 'Energy', 'Stable energy levels are a key benefit of a balanced diet.'),
(2, 'Which function does a balanced diet NOT typically support?', 'Immune function', 'Healthy growth', 'X-ray vision', 'Metabolic rate', 'X-ray vision', 'Immune health and growth represent standard physiological benefits.');

-- Quiz 3: Macronutrients
INSERT INTO Quiz_Questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(3, 'Which macronutrient is the body\'s primary energy source?', 'Protein', 'Fats', 'Carbohydrates', 'Vitamins', 'Carbohydrates', 'Carbs are the preferred fuel for the brain and muscles.'),
(3, 'How many calories are in 1 gram of protein?', '4', '7', '9', '12', '4', 'Protein and carbs both provide 4 calories per gram.'),
(3, 'Which of these is a function of proteins?', 'Muscle repair', 'Immediate energy', 'Stored energy', 'Vitamin absorption', 'Muscle repair', 'Proteins are building blocks for tissues.'),
(3, 'Saturated and trans fats are generally considered:', 'Healthy', 'Less healthy', 'Essential', 'Non-caloric', 'Less healthy', 'These fats can increase health risks if consumed in excess.');

-- 6. HABITS (As seen in HabitsPage.tsx)
INSERT INTO Habits (user_id, title, description, frequency, target_value, unit) VALUES
(2, 'Drink Water', 'Drink at least 8 glasses of water daily', 'daily', 8, 'glasses'),
(2, 'Eat Fruits & Veggies', '5 servings of fruits and vegetables', 'daily', 5, 'servings'),
(2, 'Daily Exercise', '30 minutes of physical activity', 'daily', 30, 'minutes'),
(3, 'Drink Water', 'Hydration is key', 'daily', 6, 'glasses');

-- 7. BADGES (As seen in DashboardPage.tsx)
INSERT INTO Badges (badge_id, name, description, criteria_type, criteria_value) VALUES
(1, 'First Lesson', 'Completed your very first lesson!', 'lesson_complete', 1),
(2, 'Quiz Master', 'Scored 100% on a quiz', 'quiz_pass', 1),
(3, '7 Day Streak', 'Logged in for 7 days in a row', 'streak', 7),
(4, 'Module Complete', 'Finished all lessons in a module', 'module_complete', 1),
(5, '30 Day Streak', 'A month of consistent learning', 'streak', 30),
(6, 'Expert', 'Complete all available modules', 'module_complete', 6);

-- 8. STREAKS
INSERT INTO Streaks (user_id, current_streak, longest_streak, last_activity_date) VALUES
(2, 7, 12, CURDATE()),
(3, 1, 3, CURDATE());

-- 9. USER_PROGRESS (Initial Progress for Apurva)
INSERT INTO User_Progress (user_id, lesson_id, status, score, completed_at) VALUES
-- Module 1
(2, 1, 'completed', 100.00, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 2, 'completed', 90.00, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(2, 3, 'completed', NULL, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 4, 'unlocked', NULL, NULL),
(2, 5, 'locked', NULL, NULL);

-- 10. USER_BADGES
INSERT INTO User_Badges (user_id, badge_id, awarded_at) VALUES
(2, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 2, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 3, NOW());
