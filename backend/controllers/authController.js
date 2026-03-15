// Auth Controller — handles user registration and login

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const SALT_ROUNDS = 10;
const JWT_EXPIRY = '7d';

// ─── POST /api/auth/register ──────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { name, email, password, age, height, weight, gender, health_goal } = req.body;

    // ── Validate required fields ──────────────────────────────────────────────
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'name, email, and password are required.',
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // ── Check for duplicate email ─────────────────────────────────────────────
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // ── Hash password ─────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // ── Persist user ──────────────────────────────────────────────────────────
    const insertId = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      hashedPassword,
      age: age ?? null,
      height_cm: height ?? null,   // frontend sends "height"
      weight_kg: weight ?? null,   // frontend sends "weight"
      gender: gender ?? null,
      health_goal: health_goal ?? null,
    });

    // ── Fetch the newly created user (no password) ────────────────────────────
    const newUser = await User.findById(insertId);

    return res.status(201).json({
      message: 'User registered successfully.',
      user: newUser,
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ── Validate required fields ──────────────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required.' });
    }

    // ── Find user ─────────────────────────────────────────────────────────────
    const user = await User.findByEmail(email.toLowerCase().trim());
    if (!user) {
      // Generic message — don't reveal whether the email exists
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // ── Verify password ───────────────────────────────────────────────────────
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // ── Sign JWT ──────────────────────────────────────────────────────────────
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // ── Build safe user object (no password_hash) ─────────────────────────────
    const { password_hash, ...safeUser } = user;

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};
