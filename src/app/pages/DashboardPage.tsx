import { Link, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Progress } from '../components/ui/progress';
import { NavBar } from '../components/NavBar';
import { Trophy, Flame, Star, BookOpen, Calculator, CheckSquare, ArrowRight, Zap } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let frame: number;
    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{display}</>;
}

const badgesData = [
  { emoji: '🏆', label: 'First Lesson',      color: 'bg-yellow-100' },
  { emoji: '🔥', label: '7 Day Streak',      color: 'bg-orange-100' },
  { emoji: '⭐', label: 'Quiz Master',       color: 'bg-green-100' },
  { emoji: '🎯', label: 'Module Complete',   color: 'bg-blue-100' },
  { emoji: '💪', label: '30 Day Streak',     color: 'bg-pink-100' },
  { emoji: '👑', label: 'Expert',            color: 'bg-purple-100' },
  { emoji: '💯', label: 'Perfect Score',     color: 'bg-red-100' },
  { emoji: '🚀', label: 'Quick Learner',     color: 'bg-cyan-100' },
  { emoji: '🐢', label: 'Persistent Learner', color: 'bg-amber-100' },
  { emoji: '⚡', label: 'Fast Learner',       color: 'bg-emerald-100' },
];

export default function DashboardPage() {
  const { user, points, streak, moduleProgress, badges, token } = useApp();
  const navigate = useNavigate();
  const [bmiCategory, setBmiCategory] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user profile to get latest BMI
    if (!token) return;
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    fetch(`${API_BASE}/user/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data?.stats?.bmi_category) setBmiCategory(data.stats.bmi_category);
      })
      .catch(() => {});
  }, [token]);

  const bmiGoalMap: Record<string, { emoji: string; text: string }> = {
    Underweight: { emoji: '🥗', text: 'Increase calorie intake with nutritious foods' },
    Normal:      { emoji: '✅', text: 'Maintain a balanced and varied diet' },
    Overweight:  { emoji: '🏃', text: 'Reduce calorie intake and increase activity' },
    Obese:       { emoji: '💪', text: 'Focus on portion control and daily exercise' },
  };
  const bmiGoal = bmiCategory ? bmiGoalMap[bmiCategory] : null;

  const totalProgress = moduleProgress.length > 0
    ? Math.round(moduleProgress.reduce((sum, mod) => sum + mod.progress, 0) / moduleProgress.length)
    : 0;

  const moduleNames: Record<string, string> = {
    'nutrition-basics': '🍎 Nutrition Basics',
    'balanced-diet': '⚖️ Balanced Diet',
  };

  const level = Math.floor(points / 100) + 1;
  const levelProgress = (points % 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <NavBar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋
              </h2>
              <p className="text-gray-500 mt-1">Ready to continue your nutrition journey?</p>
            </div>
            {/* Level Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl px-4 py-3 shadow-lg"
            >
              <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <div>
                <div className="text-xs opacity-80">Level</div>
                <div className="font-bold text-lg leading-none">{level}</div>
              </div>
              <div className="w-20">
                <div className="text-xs opacity-70 mb-1">{levelProgress}/100 XP</div>
                <div className="h-1.5 bg-white/30 rounded-full">
                  <motion.div
                    className="h-full bg-yellow-300 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            {
              gradient: 'from-yellow-400 via-orange-400 to-orange-500',
              icon: Trophy,
              value: points,
              label: 'Total Points',
              sub: 'Keep earning!',
              delay: 0,
            },
            {
              gradient: 'from-red-400 via-red-500 to-pink-500',
              icon: Flame,
              value: streak,
              label: 'Day Streak',
              sub: "You're on fire! 🔥",
              delay: 0.1,
            },
            {
              gradient: 'from-green-400 via-green-500 to-emerald-600',
              icon: Star,
              value: totalProgress,
              label: '% Progress',
              sub: 'Overall completion',
              delay: 0.2,
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: card.delay, type: 'spring', stiffness: 200 }}
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300 } }}
                className={`bg-gradient-to-br ${card.gradient} text-white rounded-3xl p-6 shadow-xl cursor-default`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold leading-none">
                      <AnimatedNumber value={card.value} />
                      {i === 2 ? '%' : ''}
                    </div>
                    <div className="text-sm opacity-80 mt-1">{card.label}</div>
                  </div>
                </div>
                <div className="bg-white/20 rounded-xl px-3 py-2 text-sm backdrop-blur-sm">
                  {card.sub}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-gray-900">Learning Progress</h3>
                <Link to="/modules" className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                  See all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-5">
                {moduleProgress.map((mod, i) => (
                  <motion.div
                    key={mod.moduleId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">
                        {moduleNames[mod.moduleId] || mod.moduleId}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">{mod.progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${mod.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  to: '/modules',
                  icon: BookOpen,
                  emoji: '📚',
                  title: 'Continue Learning',
                  sub: 'Resume next lesson',
                  color: 'green',
                  delay: 0.4,
                },
                {
                  to: '/habits',
                  icon: CheckSquare,
                  emoji: '✅',
                  title: 'Daily Habits',
                  sub: 'Track your day',
                  color: 'blue',
                  delay: 0.5,
                },
                {
                  to: '/bmi-calculator',
                  icon: Calculator,
                  emoji: '🧮',
                  title: 'BMI Check',
                  sub: 'Calculate & learn',
                  color: 'purple',
                  delay: 0.6,
                },
              ].map((action) => {
                const colorMap: Record<string, { bg: string; hover: string; icon: string }> = {
                  green: { bg: 'bg-green-50', hover: 'hover:border-green-400', icon: 'text-green-600' },
                  blue: { bg: 'bg-blue-50', hover: 'hover:border-blue-400', icon: 'text-blue-600' },
                  purple: { bg: 'bg-purple-50', hover: 'hover:border-purple-400', icon: 'text-purple-600' },
                };
                const colors = colorMap[action.color];
                const Icon = action.icon;
                return (
                  <Link key={action.to} to={action.to}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: action.delay }}
                      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300 } }}
                      className={`${colors.bg} border-2 border-transparent ${colors.hover} rounded-2xl p-5 cursor-pointer transition-all`}
                    >
                      <div className="text-3xl mb-3">{action.emoji}</div>
                      <div className="font-semibold text-gray-900">{action.title}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{action.sub}</div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right column: Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-3xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-5">Achievements</h3>
            <div className="grid grid-cols-3 gap-3">
              {badgesData.map((badge, i) => {
                const isEarned = badges?.some((b: any) => b.name === badge.label);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.07, type: 'spring', stiffness: 200 }}
                    whileHover={isEarned ? { scale: 1.1, rotate: 5 } : {}}
                    className={`text-center cursor-default ${!isEarned ? 'opacity-35' : ''}`}
                  >
                    <div className={`w-14 h-14 ${isEarned ? badge.color : 'bg-gray-100'} rounded-2xl flex items-center justify-center mx-auto mb-1.5 shadow-sm`}>
                      <span className="text-2xl">{badge.emoji}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-tight">{badge.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Daily Goal */}
            <div className="mt-6 pt-5 border-t">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-800 text-sm">Today's Goal</span>
                <span className="text-xs text-gray-500">1/3 completed</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Complete a lesson', done: false, emoji: '📖' },
                  { label: 'Log your habits', done: false, emoji: '✅' },
                  { label: 'Check your BMI', done: !!bmiCategory, emoji: '🧮' },
                ].map((goal, i) => (
                  <motion.div
                    key={i}
                    className={`flex items-center gap-3 p-2.5 rounded-xl text-sm ${goal.done ? 'bg-green-50' : 'bg-gray-50'}`}
                  >
                    <span className="text-lg">{goal.emoji}</span>
                    <span className={`flex-1 ${goal.done ? 'text-green-700 line-through' : 'text-gray-600'}`}>
                      {goal.label}
                    </span>
                    {goal.done && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                        className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <span className="text-white text-xs">✓</span>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
                {bmiGoal && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100 text-sm mt-2"
                  >
                    <span className="text-lg">{bmiGoal.emoji}</span>
                    <div>
                      <div className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-0.5">BMI Goal · {bmiCategory}</div>
                      <span className="text-blue-800">{bmiGoal.text}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
