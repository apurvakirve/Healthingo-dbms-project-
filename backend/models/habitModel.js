// Habit model — database query helpers for the Habit_Logs table

import pool from '../config/db.js';

const Habit = {
  /**
   * Log daily habits for a user.
   * Uses UPSERT logic (INSERT ... ON DUPLICATE KEY UPDATE).
   */
  async upsertLog({ userId, waterIntake, fruitsEaten, exerciseDone, date }) {
    const [result] = await pool.query(
      `INSERT INTO Habit_Logs (user_id, water_intake, fruits_eaten, exercise_done, log_date)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         water_intake = VALUES(water_intake),
         fruits_eaten = VALUES(fruits_eaten),
         exercise_done = VALUES(exercise_done)`,
      [userId, waterIntake, fruitsEaten, exerciseDone, date]
    );
    return result.affectedRows > 0;
  },

  /**
   * Fetch habit logs for the last 7 days for a user.
   */
  async findWeeklyLogs(userId) {
    const [rows] = await pool.query(
      `SELECT water_intake, fruits_eaten, exercise_done, log_date
       FROM Habit_Logs
       WHERE user_id = ? AND log_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       ORDER BY log_date ASC`,
      [userId]
    );
    return rows;
  },
  /**
   * Create a new custom habit for a user.
   */
  async createHabit({ userId, habitName, habitDescription, frequency }) {
    const [result] = await pool.query(
      `INSERT INTO Custom_Habits (user_id, habit_name, habit_description, frequency, created_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [userId, habitName, habitDescription || null, frequency || 'daily']
    );
    return result.insertId;
  },

  /**
   * Fetch all custom habits for a user.
   */
  async getUserHabits(userId) {
    const [rows] = await pool.query(
      `SELECT habit_id, habit_name, habit_description, frequency, created_at
       FROM Custom_Habits
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  },
};

export default Habit;
