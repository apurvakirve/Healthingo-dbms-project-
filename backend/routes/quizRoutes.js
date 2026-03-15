// Quiz Routes — GET /api/lessons/:lessonId/quiz  |  POST /api/quiz/submit

import express from 'express';
import { getQuizByLesson, submitQuiz } from '../controllers/quizController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/lessons/:lessonId/quiz — fetch quiz questions
router.get('/lessons/:lessonId/quiz', authenticateToken, getQuizByLesson);

// POST /api/quiz/submit — submit quiz answers
router.post('/quiz/submit', authenticateToken, submitQuiz);

export default router;
