// Modules Routes — GET /api/modules  |  GET /api/modules/:id

import express from 'express';
import { getAllModules, getModuleById, getModuleLessons, getLessonContent } from '../controllers/modulesController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/modules — all published modules
router.get('/', getAllModules);

// GET /api/modules/:id — single module
router.get('/:id', getModuleById);

// GET /api/modules/:moduleId/lessons — lessons per module (with user progress)
router.get('/:moduleId/lessons', authenticateToken, getModuleLessons);

// GET /api/modules/:moduleId/lessons/:lessonId — single lesson content with lock check
router.get('/:moduleId/lessons/:lessonId', authenticateToken, getLessonContent);

export default router;

