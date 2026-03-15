// Habit Routes — POST /api/habits  |  GET /api/habits/:userId  |  POST /api/habits/create  |  GET /api/habits/mine

import express from 'express';
import { logHabits, getHabitHistory, createHabit, getMyHabits } from '../controllers/habitController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/habits — log daily habits
router.post('/', authenticateToken, logHabits);

// POST /api/habits/create — create a custom habit
router.post('/create', authenticateToken, createHabit);

// GET /api/habits/mine — get current user's custom habits
router.get('/mine', authenticateToken, getMyHabits);

// GET /api/habits/:userId — get weekly habit history
router.get('/:userId', authenticateToken, getHabitHistory);

export default router;
