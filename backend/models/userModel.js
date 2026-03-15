// User model — database query helpers for the Users table

import pool from '../config/db.js';

const User = {
  /**
   * Find a user by email (includes password_hash for auth checks).
   */
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  /**
   * Find a user by ID — never returns password_hash.
   */
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT user_id, name, email, age, height_cm, weight_kg, gender,
              health_goal, role, avatar_url, is_active, created_at
       FROM Users WHERE user_id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Insert a new user with all registration fields.
   * @param {object} fields
   * @param {string} fields.name
   * @param {string} fields.email
   * @param {string} fields.hashedPassword
   * @param {number} fields.age
   * @param {number} fields.height_cm
   * @param {number} fields.weight_kg
   * @param {string} fields.gender
   * @param {string} fields.health_goal
   * @returns {number} insertId
   */
  async create({ name, email, hashedPassword, age, height_cm, weight_kg, gender, health_goal }) {
    const [result] = await pool.query(
      `INSERT INTO Users
         (name, email, password_hash, age, height_cm, weight_kg, gender, health_goal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, age ?? null, height_cm ?? null, weight_kg ?? null, gender ?? null, health_goal ?? null]
    );
    return result.insertId;
  },
};

export default User;

