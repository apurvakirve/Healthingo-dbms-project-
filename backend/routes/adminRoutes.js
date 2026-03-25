import { Router } from 'express';
import { getAllUsers, createModule, createLesson, createQuizQuestion } from '../controllers/adminController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = Router();

// Protected admin midldleware for role check
const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Admin routes
router.use(authenticateToken);
router.use(isAdmin);

router.get('/users', getAllUsers);
router.post('/modules', createModule);
router.post('/lessons', createLesson);
router.post('/quizzes', createQuizQuestion);

export default router;
