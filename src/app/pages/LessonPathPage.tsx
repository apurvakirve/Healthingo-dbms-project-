import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useApp } from '../context/AppContext';
import { modules as staticModules } from '../data/modules';
import { motion, AnimatePresence } from 'motion/react';
import { NavBar } from '../components/NavBar';
import { CheckCircle, Lock, Play, ArrowLeft, Star, Loader2 } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ApiModule {
  module_id: number;
  title: string;
  description: string;
  icon: string | null;
  module_order: number;
}

interface ApiLesson {
  lesson_id: number;
  title: string;
  lesson_order: number;
  status: 'locked' | 'unlocked' | 'completed';
}

interface CommonModule {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface CommonLesson {
  id: string;
  title: string;
  order: number;
  status: 'locked' | 'unlocked' | 'completed';
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Component ──────────────────────────────────────────────────────────────────

export default function LessonPathPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { moduleProgress, token } = useApp();

  const [module, setModule]     = useState<CommonModule | null>(null);
  const [lessons, setLessons]   = useState<CommonLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError]   = useState<string | null>(null);

  // ── Fetch Data ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      if (!moduleId) return;
      setIsLoading(true);
      setApiError(null);

      try {
        // 1. Fetch Module Info
        const moduleRes = await fetch(`${API_BASE}/modules/${moduleId}`);
        if (!moduleRes.ok) throw new Error('Module fetch failed');
        const moduleData = await moduleRes.json();
        
        setModule({
          id: String(moduleData.module.module_id),
          title: moduleData.module.title,
          description: moduleData.module.description,
          icon: moduleData.module.icon ?? '📚',
        });

        // 2. Fetch Lessons (Authenticated)
        const lessonsRes = await fetch(`${API_BASE}/modules/${moduleId}/lessons`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!lessonsRes.ok) throw new Error('Lessons fetch failed');
        const lessonsData = await lessonsRes.json();

        const normalizedLessons: CommonLesson[] = (lessonsData.lessons as ApiLesson[]).map(l => ({
          id: String(l.lesson_id),
          title: l.title,
          order: l.lesson_order,
          status: l.status,
        }));

        setLessons(normalizedLessons);
      } catch (err: any) {
        setApiError(err.message || 'Failed to connect to server');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [moduleId, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <NavBar />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
          <p className="text-gray-500 font-medium">Loading your path...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤷</div>
          <h2 className="text-2xl font-bold mb-4">Module not found</h2>
          <Link to="/modules" className="text-green-600 hover:text-green-700 font-medium">
            ← Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = lessons.filter(l => l.status === 'completed').length;
  const overallProgress = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
  const isModuleComplete = completedCount === lessons.length && lessons.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <NavBar />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back */}
        <Link to="/modules">
          <motion.div
            whileHover={{ x: -4 }}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            All Modules
          </motion.div>
        </Link>

        {/* Offline notice */}
        {apiError && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 flex items-center gap-2">
            <span>⚠️</span> {apiError}
          </div>
        )}

        {/* Module Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-3xl p-6 mb-8 shadow-xl relative overflow-hidden"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 -left-4 w-24 h-24 bg-white/10 rounded-full" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="text-5xl">{module.icon}</div>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-sm">
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span>{completedCount}/{lessons.length} done</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1">{module.title}</h1>
            <p className="text-green-100 text-sm mb-4">{module.description}</p>

            {/* Progress Bar */}
            <div className="h-2.5 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
            <div className="text-right text-xs mt-1 opacity-80">{overallProgress}% complete</div>
          </div>
        </motion.div>

        {/* Lesson Path */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-green-300 via-gray-200 to-gray-200 z-0" />

          <div className="space-y-6">
            {lessons.map((lesson, index) => {
              const isCompleted = lesson.status === 'completed';
              const isUnlocked  = lesson.status !== 'locked';
              const isCurrent   = lesson.status === 'unlocked';

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                  className="relative flex items-start gap-5"
                >
                  {/* Node */}
                  <div className="relative z-10 flex-shrink-0">
                    {isCurrent ? (
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-200"
                      >
                        <Play className="w-5 h-5 text-white fill-white" />
                      </motion.div>
                    ) : isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-md"
                      >
                        <CheckCircle className="w-6 h-6 text-white" />
                      </motion.div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Card */}
                  <div className={`flex-1 transition-all ${!isUnlocked ? 'opacity-50' : ''}`}>
                    {isUnlocked ? (
                      <Link to={`/modules/${moduleId}/lessons/${lesson.id}`}>
                        <motion.div
                          whileHover={{ x: 4, transition: { type: 'spring', stiffness: 300 } }}
                          className={`rounded-2xl p-4 border-2 cursor-pointer transition-all ${
                            isCompleted
                              ? 'bg-green-50 border-green-200'
                              : isCurrent
                              ? 'bg-white border-green-400 shadow-lg shadow-green-100'
                              : 'bg-white border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                  Lesson {index + 1}
                                </span>
                                {isCompleted && (
                                  <span className="text-xs bg-green-100 text-green-600 rounded-full px-2 py-0.5 font-medium">
                                    ✓ Done
                                  </span>
                                )}
                                {isCurrent && (
                                  <motion.span
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="text-xs bg-green-500 text-white rounded-full px-2 py-0.5 font-medium"
                                  >
                                    ← Current
                                  </motion.span>
                                )}
                              </div>
                              <h3 className="font-bold text-gray-900">{lesson.title}</h3>
                            </div>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ml-3 ${
                              isCompleted ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Play className="w-4 h-4 text-gray-500" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ) : (
                      <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4">
                        <div className="text-xs text-gray-400 mb-0.5">Lesson {index + 1}</div>
                        <h3 className="font-bold text-gray-400">{lesson.title}</h3>
                        <div className="text-xs text-gray-400 mt-1">🔒 Complete previous lesson to unlock</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Completion Banner */}
          <AnimatePresence>
            {isModuleComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                className="mt-10 bg-gradient-to-br from-yellow-400 to-orange-400 text-white rounded-3xl p-8 text-center shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">Module Complete!</h2>
                <p className="text-yellow-100 mb-6">You crushed {module.title}! Keep the momentum going!</p>
                <Link to="/modules">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-white text-orange-500 font-bold rounded-full px-6 py-3 cursor-pointer shadow-lg"
                  >
                    🚀 Next Module
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
