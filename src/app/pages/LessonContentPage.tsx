import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { NavBar } from '../components/NavBar';
import { ArrowLeft, ChevronRight, Lightbulb, BookOpen, Clock, Play } from 'lucide-react';

const lessonIllustrations: Record<string, string[]> = {
  'nutrition-basics': ['🥗', '🍎', '🥦', '🍊', '🫐'],
  'balanced-diet': ['⚖️', '🥗', '🥩', '🥑', '🍚'],
  'macronutrients': ['💪', '🥩', '🥚', '🫘', '🧀'],
  'micronutrients': ['💊', '🫐', '🥕', '🥦', '🥜'],
  'healthy-habits': ['✨', '💧', '🏃', '🌙', '🧘'],
  'diet-goals': ['🎯', '⚖️', '💪', '🏋️', '🏃'],
};

export default function LessonContentPage() {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { token } = useApp();

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalLessons, setTotalLessons] = useState(0);
  const [moduleInfo, setModuleInfo] = useState<any>(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const loadLesson = async () => {
      if (!moduleId || !lessonId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/modules/${moduleId}/lessons/${lessonId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Failed to load lesson');
        }

        const data = await res.json();
        setLesson(data.lesson);

        // Also fetch siblings for "next lesson" link and lesson count
        const siblingsRes = await fetch(`${API_BASE}/modules/${moduleId}/lessons`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (siblingsRes.ok) {
          const siblingsData = await siblingsRes.json();
          setTotalLessons(siblingsData.lessons.length);
        }

        // Fetch Module info for title/icon
        const moduleRes = await fetch(`${API_BASE}/modules/${moduleId}`);
        if (moduleRes.ok) {
          const mData = await moduleRes.json();
          setModuleInfo(mData.module);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadLesson();
  }, [moduleId, lessonId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-8">
        <div className="text-center bg-white rounded-3xl p-8 shadow-xl max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">{error || 'Lesson not found'}</h2>
          <p className="text-gray-500 mb-6">This content might be locked or unavailable.</p>
          <Link to={`/modules/${moduleId}`} className="bg-green-500 text-white rounded-2xl px-6 py-3 font-semibold hover:bg-green-600 transition-all inline-block">
            Back to Module
          </Link>
        </div>
      </div>
    );
  }

  const foodIcons = lessonIllustrations[moduleId || ''] || ['🥗', '🍎', '🥦'];
  const sentences = lesson.content.split('. ').map((s: string) => s.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <NavBar />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back */}
        <Link to={`/modules/${moduleId}`}>
          <motion.div
            whileHover={{ x: -4 }}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {moduleInfo?.title || 'Lessons'}
          </motion.div>
        </Link>

        {/* Lesson Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-green-600 bg-green-100 rounded-full px-3 py-1">
              Lesson {lesson.lesson_order} of {totalLessons}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> ~5 min read
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
        </motion.div>

        {/* Illustration Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-xl"
        >
          <div className="absolute inset-0 overflow-hidden">
            {foodIcons.map((icon, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl opacity-20"
                style={{
                  left: `${10 + i * 18}%`,
                  top: `${20 + (i % 2) * 40}%`,
                }}
                animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
              >
                {icon}
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 text-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl mb-3"
            >
              {moduleInfo?.icon || '📚'}
            </motion.div>
            <h2 className="text-white text-xl font-bold">{lesson.title}</h2>
            <p className="text-green-100 text-sm mt-1">{moduleInfo?.title}</p>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-900">Lesson Content</h3>
          </div>

          <div className="space-y-3">
            {sentences.map((sentence: string, i: number) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="text-gray-700 leading-relaxed"
              >
                {sentence}{i < sentences.length - 1 ? '.' : ''}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* Key Takeaways */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-amber-900">Key Takeaways</h3>
          </div>
          <ul className="space-y-2.5">
            {[
              'Understanding this concept is fundamental to healthy eating',
              'Apply this knowledge in your daily food choices',
              'Small consistent changes lead to big long-term results',
            ].map((takeaway, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                className="flex items-start gap-2 text-amber-800 text-sm"
              >
                <span className="text-amber-500 mt-0.5">✦</span>
                {takeaway}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: totalLessons }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className={`rounded-full transition-all ${
                i + 1 === lesson.lesson_order
                  ? 'w-6 h-2.5 bg-green-500'
                  : i + 1 < lesson.lesson_order
                  ? 'w-2.5 h-2.5 bg-green-300'
                  : 'w-2.5 h-2.5 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4"
        >
          <Link to={`/modules/${moduleId}`} className="flex-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-medium text-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              ← Back to Lessons
            </motion.div>
          </Link>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(22,163,74,0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/modules/${moduleId}/lessons/${lessonId}/quiz`)}
            className="flex-1 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4" />
            Take the Quiz
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
