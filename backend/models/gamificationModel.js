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
  async checkAndAwardBadges(userId) {
    // 1. Check for Lesson Completion milestone (e.g., First Lesson)
    const [completedRows] = await pool.query(
      "SELECT COUNT(*) as count FROM User_Progress WHERE user_id = ? AND status = 'completed'",
      [userId]
    );
    const completedCount = completedRows[0].count;

    if (completedCount >= 1) {
      await this.awardBadgeByName(userId, 'First Lesson');
    }
    if (completedCount >= 10) {
      await this.awardBadgeByName(userId, 'Expert');
    }

    // 2. Check for Streak milestones
    const [streakRows] = await pool.query('SELECT current_streak FROM Streaks WHERE user_id = ?', [userId]);
    const streak = streakRows[0]?.current_streak || 0;
    if (streak >= 7) {
      await this.awardBadgeByName(userId, '7 Day Streak');
    }
    if (streak >= 30) {
      await this.awardBadgeByName(userId, '30 Day Streak');
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
