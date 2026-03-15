// Module model — database query helpers for the Modules table

import pool from '../config/db.js';

const Module = {
  /**
   * Fetch all published modules ordered by module_order.
   * Returns: module_id, title, description, icon, module_order, lesson_count
   */
  async findAllPublished() {
    const [rows] = await pool.query(
      `SELECT
         m.module_id,
         m.title,
         m.description,
         m.icon,
         m.module_order,
         COUNT(l.lesson_id) AS lesson_count
       FROM Modules m
       LEFT JOIN Lessons l ON l.module_id = m.module_id AND l.is_published = TRUE
       WHERE m.is_published = TRUE
       GROUP BY m.module_id
       ORDER BY m.module_order ASC`
    );
    return rows;
  },

  /**
   * Fetch a single module by its ID (published only).
   */
  async findById(moduleId) {
    const [rows] = await pool.query(
      `SELECT
         m.module_id,
         m.title,
         m.description,
         m.icon,
         m.module_order
       FROM Modules m
       WHERE m.module_id = ? AND m.is_published = TRUE`,
      [moduleId]
    );
    return rows[0] || null;
  },
};

export default Module;
