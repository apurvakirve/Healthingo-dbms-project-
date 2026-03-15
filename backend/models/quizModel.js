// Quiz model — database query helpers for Quizzes and Quiz_Questions

import pool from '../config/db.js';

const Quiz = {
  /**
   * Fetch quiz and its questions for a specific lesson.
   */
  async findByLessonId(lessonId) {
    // 1. Get the quiz info
    const [quizRows] = await pool.query(
      'SELECT quiz_id, title, pass_score, time_limit FROM Quizzes WHERE lesson_id = ? AND is_published = TRUE',
      [lessonId]
    );
    
    if (quizRows.length === 0) return null;
    const quiz = quizRows[0];

    // 2. Get the questions
    const [questionRows] = await pool.query(
      `SELECT question_id, question_text, question_type, option_a, option_b, option_c, option_d, correct_answer, explanation
       FROM Quiz_Questions
       WHERE quiz_id = ?
       ORDER BY question_order ASC`,
      [quiz.quiz_id]
    );

    return {
      ...quiz,
      questions: questionRows.map(q => ({
        id: q.question_id,
        question: q.question_text,
        type: q.question_type,
        options: [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean),
        correctAnswer: q.correct_answer, // This might be the index or text depending on frontend expectations
        explanation: q.explanation
      }))
    };
  },

  /**
   * Record a quiz attempt.
   */
  async createAttempt({ userId, quizId, score, passed, answersJson }) {
    const [result] = await pool.query(
      `INSERT INTO Quiz_Attempts (user_id, quiz_id, score, passed, answers_json, submitted_at)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [userId, quizId, score, passed, JSON.stringify(answersJson)]
    );
    return result.insertId;
  },

  /**
   * Update user progress for a lesson.
   * If passing, sets status to 'completed'.
   */
  async updateUserProgress(userId, lessonId, status, score) {
    await pool.query(
      `INSERT INTO User_Progress (user_id, lesson_id, status, score)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         status = IF(status = 'completed', 'completed', VALUES(status)),
         score = GREATEST(COALESCE(score, 0), VALUES(score)),
         completed_at = IF(VALUES(status) = 'completed' AND (completed_at IS NULL), CURRENT_TIMESTAMP, completed_at)`,
      [userId, lessonId, status, score]
    );
  }
};

export default Quiz;
