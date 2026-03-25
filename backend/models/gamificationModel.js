// Gamification model — handles points, streaks, and badges

import pool from '../config/db.js';

const Gamification = {
  /**
   * Update user's learning streak.
   * Logic:
   * - If last_activity_date was yesterday: increment current_streak.
   * - If last_activity_date was today: do nothing.
   * - Else: reset current_streak to 1.
   * - Always update longest_streak if current > longest.
   */
  async updateStreak(userId) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Get current streak info
    const [rows] = await pool.query('SELECT * FROM Streaks WHERE user_id = ?', [userId]);
    
    if (rows.length === 0) {
      // First time activity
      await pool.query(
        `INSERT INTO Streaks (user_id, current_streak, longest_streak, last_activity_date)
         VALUES (?, 1, 1, ?)`,
        [userId, today]
      );
      return { current_streak: 1, longest_streak: 1 };
    }

    const { current_streak, longest_streak, last_activity_date } = rows[0];
    const lastDate = last_activity_date ? new Date(last_activity_date).toISOString().split('T')[0] : null;

    if (lastDate === today) {
      return { current_streak, longest_streak };
    }

    let newStreak = 1;
    if (lastDate === yesterdayStr) {
      newStreak = current_streak + 1;
    }

    const newLongest = Math.max(newStreak, longest_streak);

    await pool.query(
      `UPDATE Streaks 
       SET current_streak = ?, longest_streak = ?, last_activity_date = ?
       WHERE user_id = ?`,
      [newStreak, newLongest, today, userId]
    );

    return { current_streak: newStreak, longest_streak: newLongest };
  },

  /**
   * Add points to a user.
   */
  async addPoints(userId, points) {
    const [result] = await pool.query(
      'UPDATE Users SET points = points + ? WHERE user_id = ?',
      [points, userId]
    );
    return result.affectedRows > 0;
  },

  /**
   * Fetch all earned badges for a user.
   */
  async getUserBadges(userId) {
    const [rows] = await pool.query(
      `SELECT b.* 
       FROM Badges b
       JOIN User_Badges ub ON b.badge_id = ub.badge_id
       WHERE ub.user_id = ?`,
      [userId]
    );
    return rows;
  },

  /**
   * Check and award badges based on criteria.
   * Simplified for now: awards specific badges based on milestone counts.
   */
  /**
   * Check and award badges based on criteria.
   * This function checks all defined badges and awards those whose criteria are met.
   */
  async checkAndAwardBadges(userId) {
    try {
      // Fetch all available badges to check criteria dynamically
      const [badges] = await pool.query('SELECT * FROM Badges');
      
      // Fetch user's current stats and progress for checking
      const [completedLessons] = await pool.query(
        "SELECT COUNT(*) as count FROM User_Progress WHERE user_id = ? AND status = 'completed'",
        [userId]
      );
      const lessonCount = completedLessons[0].count;

      const [streakRows] = await pool.query('SELECT current_streak FROM Streaks WHERE user_id = ?', [userId]);
      const currentStreak = streakRows[0]?.current_streak || 0;

      // 1. Process standard criteria types from the Badges table
      for (const badge of badges) {
        let isEligible = false;

        switch (badge.criteria_type) {
          case 'lesson_complete':
            isEligible = lessonCount >= (badge.criteria_value || 1);
            break;
          
          case 'streak':
            isEligible = currentStreak >= (badge.criteria_value || 1);
            break;

          case 'quiz_pass':
            // Awarded if user has passed at least X quizzes
            const [passRows] = await pool.query(
              "SELECT COUNT(DISTINCT quiz_id) as count FROM Quiz_Attempts WHERE user_id = ? AND passed = TRUE",
              [userId]
            );
            isEligible = passRows[0].count >= (badge.criteria_value || 1);
            break;

          case 'module_complete':
            // Special logic for Module Complete and Expert
            if (badge.name === 'Module Complete') {
              const [modRows] = await pool.query(
                `SELECT COUNT(*) as completed_modules FROM (
                  SELECT m.module_id 
                  FROM Modules m
                  JOIN Lessons l ON m.module_id = l.module_id
                  LEFT JOIN User_Progress up ON l.lesson_id = up.lesson_id AND up.user_id = ?
                  GROUP BY m.module_id
                  HAVING COUNT(l.lesson_id) = SUM(CASE WHEN up.status = 'completed' THEN 1 ELSE 0 END)
                ) as completed_mods`,
                [userId]
              );
              isEligible = modRows[0].completed_modules >= (badge.criteria_value || 1);
            } else if (badge.name === 'Expert') {
              const [totalMods] = await pool.query('SELECT COUNT(*) as count FROM Modules');
              const [completedMods] = await pool.query(
                `SELECT COUNT(*) as count FROM (
                  SELECT m.module_id 
                  FROM Modules m
                  JOIN Lessons l ON m.module_id = l.module_id
                  LEFT JOIN User_Progress up ON l.lesson_id = up.lesson_id AND up.user_id = ?
                  GROUP BY m.module_id
                  HAVING COUNT(l.lesson_id) = SUM(CASE WHEN up.status = 'completed' THEN 1 ELSE 0 END)
                ) as completed_mods`,
                [userId]
              );
              isEligible = completedMods[0].count >= totalMods[0].count;
            }
            break;
        }

        if (isEligible) {
          await this.awardBadgeByName(userId, badge.name);
        }
      }

      // 2. Process special "Behavioral" badges (Perfect Score, Quick Learner, Persistent Learner, Fast Learner)
      
      // Perfect Score: Any quiz attempt has 100%
      const [perfectRows] = await pool.query(
        "SELECT 1 FROM Quiz_Attempts WHERE user_id = ? AND score = 100 LIMIT 1",
        [userId]
      );
      if (perfectRows.length > 0) await this.awardBadgeByName(userId, 'Perfect Score');

      // Quick Learner: 100% on the very first attempt of any quiz
      const [quickRows] = await pool.query(
        `SELECT 1 FROM Quiz_Attempts qa
         WHERE qa.user_id = ? AND qa.score = 100
         AND (SELECT COUNT(*) FROM Quiz_Attempts qa2 WHERE qa2.user_id = qa.user_id AND qa2.quiz_id = qa.quiz_id) = 1
         LIMIT 1`,
        [userId]
      );
      if (quickRows.length > 0) await this.awardBadgeByName(userId, 'Quick Learner');

      // Persistent Learner: Pass a quiz after 3 or more attempts
      const [persistentRows] = await pool.query(
        `SELECT 1 FROM Quiz_Attempts qa
         WHERE qa.user_id = ? AND qa.passed = TRUE
         AND (SELECT COUNT(*) FROM Quiz_Attempts qa2 WHERE qa2.user_id = qa.user_id AND qa2.quiz_id = qa.quiz_id) >= 3
         LIMIT 1`,
        [userId]
      );
      if (persistentRows.length > 0) await this.awardBadgeByName(userId, 'Persistent Learner');

      // Fast Learner: Complete 3+ lessons in a single day
      const [fastRows] = await pool.query(
        `SELECT COUNT(*) as count FROM User_Progress 
         WHERE user_id = ? AND status = 'completed' 
         AND DATE(completed_at) = CURDATE()`,
        [userId]
      );
      if (fastRows[0].count >= 3) await this.awardBadgeByName(userId, 'Fast Learner');

    } catch (error) {
      console.error('Error checking badges:', error);
    }
  },

  /**
   * Internal helper to link a badge to a user by badge name.
   */
  async awardBadgeByName(userId, badgeName) {
    const [badgeRows] = await pool.query('SELECT badge_id FROM Badges WHERE name = ?', [badgeName]);
    if (badgeRows.length > 0) {
      const badgeId = badgeRows[0].badge_id;
      // Use INSERT IGNORE or ON DUPLICATE KEY to avoid errors if already awarded
      await pool.query(
        'INSERT IGNORE INTO User_Badges (user_id, badge_id) VALUES (?, ?)',
        [userId, badgeId]
      );
    }
  },

  /**
   * Get comprehensive stats.
   */
  async getUserStats(userId) {
    const [userRows] = await pool.query('SELECT points FROM Users WHERE user_id = ?', [userId]);
    const [streakRows] = await pool.query('SELECT current_streak, longest_streak FROM Streaks WHERE user_id = ?', [userId]);
    const badges = await this.getUserBadges(userId);

    return {
      points: userRows[0]?.points || 0,
      streak: streakRows[0]?.current_streak || 0,
      longest_streak: streakRows[0]?.longest_streak || 0,
      badges
    };
  }
};

export default Gamification;
