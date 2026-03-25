import User from '../models/userModel.js';
import Module from '../models/moduleModel.js';
import Lesson from '../models/lessonModel.js';
import Quiz from '../models/quizModel.js';

export const getAllUsers = async (req, res, next) => {
  try {
    // Check if the authenticated user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const users = await User.findAll();
    return res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/admin/modules ──────────────────────────────────────────────────
export const createModule = async (req, res, next) => {
  try {
    const { title, description, icon } = req.body;
    
    // Get next module order
    const modules = await Module.findAllPublished();
    const module_order = modules.length + 1;

    const moduleId = await Module.create({ title, description, icon, module_order });
    return res.status(201).json({ message: 'Module created successfully.', moduleId });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/admin/lessons ──────────────────────────────────────────────────
export const createLesson = async (req, res, next) => {
  try {
    const { moduleId, title, content } = req.body;
    
    // Get next lesson order for module
    const lessons = await Lesson.findByModuleWithProgress(moduleId, req.user.userId);
    const lesson_order = lessons.length + 1;

    const lessonId = await Lesson.create({ 
      module_id: moduleId, title, content, lesson_order, duration_mins: 5 
    });
    return res.status(201).json({ message: 'Lesson created successfully.', lessonId });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/admin/quizzes ──────────────────────────────────────────────────
export const createQuizQuestion = async (req, res, next) => {
  try {
    const { lessonId, question, option1, option2, option3, option4, correctAnswer } = req.body;
    
    // 1. Ensure quiz exists for lesson, or create one
    let quiz = await Quiz.findByLessonId(lessonId);
    let quizId;

    if (!quiz) {
      quizId = await Quiz.create({ 
        lesson_id: lessonId, 
        title: `Quiz for Lesson ${lessonId}`,
        pass_score: 80 
      });
    } else {
      quizId = quiz.quiz_id;
    }

    // 2. Add question
    const questionId = await Quiz.addQuestion({
      quiz_id: quizId,
      question_text: question,
      option_a: option1,
      option_b: option2,
      option_c: option3,
      option_d: option4,
      correct_answer: correctAnswer, // Should map to text if frontend expects text
      explanation: 'Great job!',
      question_order: (quiz?.questions?.length || 0) + 1
    });

    return res.status(201).json({ message: 'Quiz question added successfully.', questionId });
  } catch (err) {
    next(err);
  }
};
