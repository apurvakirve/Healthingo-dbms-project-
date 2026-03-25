// Lesson model — database query helpers for the Lessons table

import pool from '../config/db.js';

const Lesson = {
  /**
   * Fetch all lessons in a module with the user's progress status.
   */
  async findByModuleWithProgress(moduleId, userId) {
    const [rows] = await pool.query(
      `SELECT 
         l.lesson_id, 
         l.module_id,
         l.title, 
         l.lesson_order,
         l.content,
         l.video_url,
         l.duration_mins,
         COALESCE(
           up.status, 
           CASE 
             WHEN l.lesson_order = 1 THEN 'unlocked'
             WHEN EXISTS (
               SELECT 1 FROM User_Progress up2
               JOIN Lessons l2 ON up2.lesson_id = l2.lesson_id
               WHERE up2.user_id = ? 
                 AND l2.module_id = l.module_id 
                 AND l2.lesson_order = l.lesson_order - 1 
                 AND up2.status = 'completed'
             ) THEN 'unlocked'
             ELSE 'locked'
           END
         ) AS status
       FROM Lessons l
       LEFT JOIN User_Progress up ON up.lesson_id = l.lesson_id AND up.user_id = ?
       WHERE l.module_id = ? AND l.is_published = TRUE
       ORDER BY l.lesson_order ASC`,
      [userId, userId, moduleId]
    );
    return rows;
  },

  /**
   * Fetch a single lesson details with calculated status for a user.
   */
  async findByIdWithProgress(lessonId, userId) {
    const [rows] = await pool.query(
      `SELECT 
         l.*, 
         COALESCE(
           up.status, 
           CASE 
             WHEN l.lesson_order = 1 THEN 'unlocked'
             WHEN EXISTS (
               SELECT 1 FROM User_Progress up2
               JOIN Lessons l2 ON up2.lesson_id = l2.lesson_id
               WHERE up2.user_id = ? 
                 AND l2.module_id = l.module_id 
                 AND l2.lesson_order = l.lesson_order - 1 
                 AND up2.status = 'completed'
             ) THEN 'unlocked'
             ELSE 'locked'
           END
         ) AS status
       FROM Lessons l
       LEFT JOIN User_Progress up ON up.lesson_id = l.lesson_id AND up.user_id = ?
       WHERE l.lesson_id = ? AND l.is_published = TRUE`,
      [userId, userId, lessonId]
    );
    return rows[0] || null;
  },

  /**
   * Fetch a single lesson details (minimal).
   */
  async findById(lessonId) {
    const [rows] = await pool.query(
      `SELECT * FROM Lessons WHERE lesson_id = ? AND is_published = TRUE`,
      [lessonId]
    );
    return rows[0] || null;
  },

  /**
   * Create a new lesson.
   */
  async create({ module_id, title, content, duration_mins, lesson_order }) {
    const [result] = await pool.query(
      `INSERT INTO Lessons (module_id, title, content, duration_mins, lesson_order, is_published)
       VALUES (?, ?, ?, ?, ?, TRUE)`,
      [module_id, title, content, duration_mins || 5, lesson_order]
    );
    return result.insertId;
  }
};

export default Lesson;
