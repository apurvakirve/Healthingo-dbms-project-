import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useApp } from '../context/AppContext';
import { modules as staticModules } from '../data/modules';
import { motion } from 'motion/react';
import { NavBar } from '../components/NavBar';
import { Play, CheckCircle, Clock, BookOpen, ChevronRight, Loader2 } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ApiModule {
  module_id: number;
  title: string;
  description: string;
  icon: string | null;
  module_order: number;
  lesson_count: number;
}

// Normalise both the API shape and the static-data shape into one common form
interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessonCount: number;
}

const moduleColors = [
  { gradient: 'from-green-400 to-emerald-500',  light: 'bg-green-50',  border: 'border-green-200',  tag: 'bg-green-100 text-green-700' },
  { gradient: 'from-blue-400 to-blue-500',       light: 'bg-blue-50',   border: 'border-blue-200',   tag: 'bg-blue-100 text-blue-700' },
  { gradient: 'from-purple-400 to-purple-500',   light: 'bg-purple-50', border: 'border-purple-200', tag: 'bg-purple-100 text-purple-700' },
  { gradient: 'from-orange-400 to-orange-500',   light: 'bg-orange-50', border: 'border-orange-200', tag: 'bg-orange-100 text-orange-700' },
  { gradient: 'from-pink-400 to-rose-500',       light: 'bg-pink-50',   border: 'border-pink-200',   tag: 'bg-pink-100 text-pink-700' },
  { gradient: 'from-yellow-400 to-amber-500',    light: 'bg-yellow-50', border: 'border-yellow-200', tag: 'bg-yellow-100 text-yellow-700' },
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Component ──────────────────────────────────────────────────────────────────

export default function ModulesPage() {
  const { moduleProgress } = useApp();

  const [modules, setModules]   = useState<ModuleCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError]   = useState<string | null>(null);

  // ── Fetch modules from API ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch(`${API_BASE}/modules`);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);

        const data = await res.json();
        const apiCards: ModuleCard[] = (data.modules as ApiModule[]).map((m) => ({
          id: String(m.module_id),
          title: m.title,
          description: m.description,
          icon: m.icon ?? '📚',
          lessonCount: Number(m.lesson_count),
        }));
        setModules(apiCards);
      } catch {
        // API unavailable — fall back to static data so the UI still works
        setApiError('Using offline data (backend unreachable).');
        const fallback: ModuleCard[] = staticModules.map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          icon: m.icon,
          lessonCount: m.lessons.length,
        }));
        setModules(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, []);

  // ── Progress helpers ─────────────────────────────────────────────────────────
  const getModuleProgress = (moduleId: string) => {
    const progress = moduleProgress.find((m) => m.moduleId === moduleId);
    return progress ? progress.progress : 0;
  };

  const getStatus = (moduleId: string) => {
    const p = getModuleProgress(moduleId);
    if (p === 0) return 'start';
    if (p === 100) return 'complete';
    return 'continue';
  };

  const statusConfig = {
    start:    { label: 'Start Module', icon: Play,         btnClass: 'bg-white text-gray-800 hover:bg-gray-50' },
    continue: { label: 'Continue',     icon: ChevronRight, btnClass: 'bg-white text-gray-800 hover:bg-gray-50' },
    complete: { label: 'Review',       icon: CheckCircle,  btnClass: 'bg-white text-green-600 hover:bg-gray-50' },
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <NavBar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Learning Modules</h1>
          </div>
          <p className="text-gray-500 ml-13">Choose a module and start your nutrition education journey</p>

          {/* Offline notice */}
          {apiError && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
              ⚠️ {apiError}
            </div>
          )}
        </motion.div>

        {/* Summary bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          {[
            { value: modules.length, label: 'Total Modules', emoji: '📚' },
            { value: modules.reduce((s, m) => s + m.lessonCount, 0), label: 'Total Lessons', emoji: '📖' },
            { value: moduleProgress.filter((m) => m.progress > 0).length, label: 'In Progress', emoji: '⚡' },
            { value: moduleProgress.filter((m) => m.progress === 100).length, label: 'Completed', emoji: '✅' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-sm border border-gray-100"
            >
              <span className="text-lg">{stat.emoji}</span>
              <span className="font-bold text-gray-900">{stat.value}</span>
              <span className="text-sm text-gray-500">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm font-medium">Loading modules...</span>
          </div>
        )}

        {/* Modules Grid */}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, i) => {
              const progress = getModuleProgress(module.id);
              const status = getStatus(module.id);
              const colors = moduleColors[i % moduleColors.length];
              const config = statusConfig[status];
              const Icon = config.icon;

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                  whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300 } }}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden group cursor-pointer"
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-br ${colors.gradient} p-6 relative overflow-hidden`}>
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-6 -left-2 w-20 h-20 bg-white/10 rounded-full" />
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="text-5xl">{module.icon}</div>
                      {status === 'complete' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                        >
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                    <div className="relative z-10 mt-3">
                      <h3 className="text-white font-bold text-xl">{module.title}</h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{module.description}</p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {module.lessonCount} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        ~{module.lessonCount * 5} min
                      </div>
                      {progress > 0 && (
                        <div className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${colors.tag}`}>
                          {progress === 100 ? 'Complete!' : `${progress}%`}
                        </div>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.08 }}
                      />
                    </div>

                    <Link to={`/modules/${module.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full bg-gradient-to-r ${colors.gradient} text-white py-2.5 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg`}
                      >
                        <Icon className="w-4 h-4" />
                        {config.label}
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
