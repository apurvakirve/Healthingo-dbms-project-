import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { modules, quizzes } from '../data/modules';
import { motion, AnimatePresence } from 'motion/react';
import { NavBar } from '../components/NavBar';
import { ArrowLeft, CheckCircle, XCircle, Trophy, Zap, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

function HeartBar({ lives }: { lives: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.span
          key={i}
          animate={i >= lives ? { scale: [1, 0.8, 1] } : {}}
          className={`text-xl ${i < lives ? 'opacity-100' : 'opacity-25'}`}
        >
          ❤️
        </motion.span>
      ))}
    </div>
  );
}

export default function QuizPage() {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { completeLesson, addPoints } = useApp();

  const module = modules.find((m) => m.id === moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);
  const quizKey = `${moduleId}-${lessonId}`;
  const questions = quizzes[quizKey] || [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isComplete, setIsComplete] = useState(false);
  const [shake, setShake] = useState(false);

  if (!module || !lesson || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold mb-2">Quiz not available</h2>
          <p className="text-gray-500 mb-6">This lesson doesn't have a quiz yet.</p>
          <Link to={`/modules/${moduleId}`} className="text-green-600 hover:text-green-700 font-medium">
            ← Back to Lessons
          </Link>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    if (answerIndex === question.correctAnswer) {
      setScore((s) => s + 1);
    } else {
      setLives((l) => l - 1);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((c) => c + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      const pointsEarned = score * 10;
      addPoints(pointsEarned);
      if (moduleId && lessonId) {
        completeLesson(moduleId, lessonId);
      }
      setIsComplete(true);
      const percentage = Math.round((score / questions.length) * 100);
      if (percentage >= 70) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#16a34a', '#22c55e', '#86efac', '#fbbf24', '#f59e0b'],
          });
        }, 300);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setLives(3);
    setIsComplete(false);
  };

  const progressPct = ((currentQuestion + (showFeedback ? 1 : 0)) / questions.length) * 100;

  // Quiz complete screen
  if (isComplete) {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);
    const isPassed = percentage >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <NavBar />
        <div className="container mx-auto px-4 py-12 max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="bg-white rounded-3xl shadow-2xl p-8 text-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-8xl mb-5"
            >
              {isPassed ? '🎉' : '💪'}
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isPassed ? 'Brilliant!' : 'Good Effort!'}
            </h2>
            <p className="text-gray-500 mb-6">{lesson.title}</p>

            {/* Score Ring */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <motion.circle
                  cx="50" cy="50" r="40"
                  stroke={isPassed ? '#22c55e' : '#f59e0b'}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - percentage / 100) }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
                <span className="text-xs text-gray-500">Score</span>
              </div>
            </div>

            {/* Points */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4 mb-6"
            >
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-xl font-bold text-yellow-700">+{finalScore * 10} Points Earned!</span>
              </div>
            </motion.div>

            {/* Result badge */}
            {isPassed && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="text-left">
                  <div className="font-semibold text-green-800">Lesson Complete!</div>
                  <div className="text-sm text-green-600">Next lesson has been unlocked 🔓</div>
                </div>
              </motion.div>
            )}

            <div className="flex gap-3">
              {!isPassed && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetQuiz}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/modules/${moduleId}`)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <NavBar />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back */}
        <Link to={`/modules/${moduleId}/lessons/${lessonId}`}>
          <motion.div
            whileHover={{ x: -4 }}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lesson
          </motion.div>
        </Link>

        {/* Quiz Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-700">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <HeartBar lives={lives} />
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-8 mb-6"
          >
            <div className="text-center mb-6">
              <span className="text-4xl">{module.icon}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                let stateClass = '';
                if (showFeedback) {
                  if (index === question.correctAnswer) {
                    stateClass = 'border-green-500 bg-green-50 text-green-800';
                  } else if (index === selectedAnswer) {
                    stateClass = 'border-red-400 bg-red-50 text-red-800';
                  } else {
                    stateClass = 'border-gray-200 opacity-50 text-gray-500';
                  }
                } else {
                  stateClass = selectedAnswer === index
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-400 hover:bg-green-50 hover:text-green-800';
                }

                const letters = ['A', 'B', 'C', 'D'];

                return (
                  <motion.button
                    key={index}
                    whileHover={!showFeedback ? { scale: 1.01, x: 4 } : {}}
                    whileTap={!showFeedback ? { scale: 0.99 } : {}}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showFeedback}
                    className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all font-medium flex items-center gap-4 ${stateClass}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      showFeedback && index === question.correctAnswer
                        ? 'bg-green-500 text-white'
                        : showFeedback && index === selectedAnswer && index !== question.correctAnswer
                        ? 'bg-red-400 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {showFeedback && index === question.correctAnswer ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : showFeedback && index === selectedAnswer && index !== question.correctAnswer ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        letters[index]
                      )}
                    </div>
                    <span>{option}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Feedback Panel */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`rounded-3xl p-5 mb-4 border-2 ${
                isCorrect
                  ? 'bg-green-50 border-green-300'
                  : 'bg-red-50 border-red-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {isCorrect ? (
                    <CheckCircle className="w-7 h-7 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-7 h-7 text-red-500 flex-shrink-0" />
                  )}
                </motion.div>
                <div>
                  <h3 className={`font-bold text-lg mb-1 ${isCorrect ? 'text-green-800' : 'text-red-700'}`}>
                    {isCorrect ? '🎉 Correct!' : '😅 Not quite...'}
                  </h3>
                  <p className="text-sm text-gray-700">{question.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(22,163,74,0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className={`w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-lg text-lg ${
                  isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    🏆 See Results
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}