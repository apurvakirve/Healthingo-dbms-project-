// Modules Controller — handles GET /api/modules

import Module from '../models/moduleModel.js';
import Lesson from '../models/lessonModel.js';

// ─── GET /api/modules ─────────────────────────────────────────────────────────
export const getAllModules = async (req, res, next) => {
  try {
    const modules = await Module.findAllPublished();
    return res.status(200).json({ modules });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/modules/:id ─────────────────────────────────────────────────────
export const getModuleById = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found.' });
    }
    return res.status(200).json({ module });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/modules/:moduleId/lessons ──────────────────────────────────────────
export const getModuleLessons = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user.userId; // Provided by authMiddleware

    const lessons = await Lesson.findByModuleWithProgress(moduleId, userId);
    return res.status(200).json({ lessons });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/modules/:moduleId/lessons/:lessonId ──────────────────────────────
export const getLessonContent = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.userId;

    const lesson = await Lesson.findByIdWithProgress(lessonId, userId);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    if (lesson.status === 'locked') {
      return res.status(403).json({ message: 'Complete previous lesson to unlock this lesson' });
    }

    return res.status(200).json({ lesson });
  } catch (err) {
    next(err);
  }
};

