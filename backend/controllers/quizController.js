// Quiz Controller — handles quiz retrieval and submission

import Quiz from '../models/quizModel.js';
import Gamification from '../models/gamificationModel.js';
import Lesson from '../models/lessonModel.js';

// ─── GET /api/lessons/:lessonId/quiz ──────────────────────────────────────────
export const getQuizByLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const quiz = await Quiz.findByLessonId(lessonId);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found for this lesson.' });
    }

    // Hide correct answers from the frontend if they are sensitive (optional)
    // For this project, we'll keep them as the frontend calculates the result too
    return res.status(200).json({ quiz });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/quiz/submit ─────────────────────────────────────────────────────
export const submitQuiz = async (req, res, next) => {
  try {
    const { lessonId, answers } = req.body; // answers is an array of objects: { questionId, selectedOptionIndex }
    const userId = req.user.userId;

    const quiz = await Quiz.findByLessonId(lessonId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // 1. Calculate Score — compare text answer (case-insensitive trim)
    let correctCount = 0;
    const results = quiz.questions.map((q) => {
      // Find the submitted answer for this question
      const submission = answers?.find(
        (a) => a.questionId === q.id
      );
      const userAnswer = submission?.selectedAnswer ?? '';
      const isCorrect =
        userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        isCorrect,
        correctAnswer: q.correctAnswer
      };
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= quiz.pass_score;

    // 2. Save Quiz Attempt
    await Quiz.createAttempt({
      userId,
      quizId: quiz.quiz_id,
      score: percentage,
      passed,
      answersJson: answers
    });

    // 3. Update Progress and Gamification if Passed
    if (passed) {
      // Mark as completed
      await Quiz.updateUserProgress(userId, lessonId, 'completed', percentage);
      
      // Points (e.g., 50 points per passed quiz)
      await Gamification.addPoints(userId, 50);
      
      // Update Streak
      await Gamification.updateStreak(userId);
      
      // Check for Badges
      await Gamification.checkAndAwardBadges(userId);
    } else {
      // Still update progress to 'unlocked' (though it should already be unlocked)
      await Quiz.updateUserProgress(userId, lessonId, 'unlocked', percentage);
    }

    return res.status(200).json({
      score: percentage,
      passed,
      correctCount,
      totalQuestions,
      results
    });
  } catch (err) {
    next(err);
  }
};
