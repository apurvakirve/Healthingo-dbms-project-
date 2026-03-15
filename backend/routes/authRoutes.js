// Auth Routes — POST /api/auth/register  |  POST /api/auth/login

import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/register — create a new account
router.post('/register', register);

// POST /api/auth/login — authenticate and receive a JWT
router.post('/login', login);

export default router;
