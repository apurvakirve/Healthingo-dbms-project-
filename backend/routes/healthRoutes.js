// Health Routes — POST /api/health/bmi

import express from 'express';
import { calculateBMI } from '../controllers/healthController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/health/bmi — calculate BMI (auth optional: saves result if logged in)
router.post('/bmi', authenticateToken, calculateBMI);

export default router;
