// User Routes — GET /api/user/stats

import express from 'express';
import { getUserStats } from '../controllers/userController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/user/stats — get points, streak, and badges
router.get('/stats', authenticateToken, getUserStats);

export default router;
