import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { NavBar } from '../components/NavBar';
import { Droplet, Apple, Dumbbell, CheckCircle, Circle, Flame, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

const habitTypes = [
  {
    id: 'water' as const,
    label: 'Drink 8 Glasses of Water',
    shortLabel: 'Hydration',
    icon: Droplet,
    emoji: '💧',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    gradient: 'from-blue-400 to-blue-600',
    activeBg: 'bg-blue-50',
    activeBorder: 'border-blue-300',
  },
  {
    id: 'fruits' as const,
    label: 'Eat 5 Servings of Fruits & Veggies',
    shortLabel: 'Fruits & Veggies',
    icon: Apple,
    emoji: '🍎',
    color: 'text-green-600',
    bg: 'bg-green-100',
    gradient: 'from-green-400 to-green-600',
    activeBg: 'bg-green-50',
    activeBorder: 'border-green-300',
  },
  {
    id: 'exercise' as const,
    label: '30 Minutes of Exercise',
    shortLabel: 'Exercise',
    icon: Dumbbell,
    emoji: '🏃',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    gradient: 'from-purple-400 to-purple-600',
    activeBg: 'bg-purple-50',
    activeBorder: 'border-purple-300',
  },
];

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      isToday: i === 0,
    });
  }
  return days;
}

export default function HabitsPage() {
  const { habits, updateHabit } = useApp();
  const days = getLast7Days();
  const today = new Date().toISOString().split('T')[0];

  const getHabitData = (date: string) =>
    habits[date] || { water: false, fruits: false, exercise: false };

  const handleToggle = (date: string, habit: 'water' | 'fruits' | 'exercise', current: boolean) => {
    updateHabit(date, habit, !current);
    if (!current) {
      // Mini confetti on check
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#22c55e', '#16a34a', '#86efac', '#fbbf24'],
        scalar: 0.6,
      });
    }
  };

  const todayData = getHabitData(today);
  const todayCompleted = Object.values(todayData).filter(Boolean).length;
  const totalPossible = days.length * habitTypes.length;
  const weekCompleted = days.reduce((sum, day) => {
    const d = getHabitData(day.date);
    return sum + Object.values(d).filter(Boolean).length;
  }, 0);
  const weekPct = Math.round((weekCompleted / totalPossible) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <NavBar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Habit Tracker</h1>
          <p className="text-gray-500 mt-1">Build healthy daily routines, one check at a time</p>
        </motion.div>

        {/* Weekly summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-3xl p-6 mb-8 relative overflow-hidden shadow-xl"
        >
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="text-green-100 text-sm mb-1">This Week's Progress</div>
              <div className="text-4xl font-bold mb-1">{weekPct}%</div>
              <div className="text-green-100 text-sm">{weekCompleted}/{totalPossible} habits completed</div>
            </div>
            <div className="text-5xl">
              {weekPct >= 80 ? '🏆' : weekPct >= 50 ? '⭐' : '💪'}
            </div>
          </div>
          <div className="relative z-10 mt-4 h-2 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${weekPct}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Today's habits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Today's Habits</h2>
            <div className="flex items-center gap-1.5 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-medium">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              {todayCompleted}/3 done
            </div>
          </div>

          <div className="space-y-4">
            {habitTypes.map((habit, i) => {
              const Icon = habit.icon;
              const isChecked = todayData[habit.id];

              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  whileHover={{ x: 4, transition: { type: 'spring', stiffness: 300 } }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isChecked
                      ? `${habit.activeBg} ${habit.activeBorder}`
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleToggle(today, habit.id, isChecked)}
                >
                  <div className={`w-12 h-12 rounded-2xl ${habit.bg} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-2xl">{habit.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${isChecked ? 'text-gray-700' : 'text-gray-700'}`}>
                      {habit.label}
                    </div>
                    <div className={`text-xs mt-0.5 ${isChecked ? habit.color : 'text-gray-400'}`}>
                      {isChecked ? '✓ Completed today' : 'Tap to mark complete'}
                    </div>
                  </div>
                  <motion.div
                    animate={isChecked ? { scale: [0, 1.3, 1] } : { scale: 1 }}
                    className="flex-shrink-0"
                  >
                    {isChecked ? (
                      <CheckCircle className={`w-7 h-7 ${habit.color}`} />
                    ) : (
                      <Circle className="w-7 h-7 text-gray-300" />
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* All done celebration */}
          <AnimatePresence>
            {todayCompleted === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-4 text-center"
              >
                <div className="text-2xl mb-1">🎉</div>
                <div className="font-bold">All habits done for today!</div>
                <div className="text-sm text-yellow-100">You're amazing — keep it up!</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Weekly Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-5">Weekly Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr>
                  <th className="text-left pb-4 pr-4 w-44 text-sm text-gray-500 font-medium">Habit</th>
                  {days.map((day) => (
                    <th key={day.date} className="text-center pb-4 px-2 min-w-[44px]">
                      <div className={`text-xs font-medium ${day.isToday ? 'text-green-600' : 'text-gray-400'}`}>
                        {day.dayName}
                      </div>
                      <div className={`text-sm font-bold w-8 h-8 flex items-center justify-center mx-auto rounded-full ${
                        day.isToday ? 'bg-green-500 text-white' : 'text-gray-700'
                      }`}>
                        {day.dayNum}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {habitTypes.map((habit, hi) => {
                  const Icon = habit.icon;
                  return (
                    <tr key={habit.id} className="border-t border-gray-100">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${habit.bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-3.5 h-3.5 ${habit.color}`} />
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{habit.shortLabel}</span>
                        </div>
                      </td>
                      {days.map((day, di) => {
                        const habitData = getHabitData(day.date);
                        const isChecked = habitData[habit.id];
                        return (
                          <td key={day.date} className="text-center py-3 px-2">
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleToggle(day.date, habit.id, isChecked)}
                              className="w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-all"
                            >
                              <motion.div
                                animate={isChecked ? { scale: [0.8, 1.2, 1] } : { scale: 1 }}
                              >
                                {isChecked ? (
                                  <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${habit.gradient} flex items-center justify-center shadow-md`}>
                                    <span className="text-white text-xs">✓</span>
                                  </div>
                                ) : (
                                  <div className="w-7 h-7 rounded-full border-2 border-gray-200 hover:border-gray-300" />
                                )}
                              </motion.div>
                            </motion.button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {habitTypes.map((habit, i) => {
            const count = days.filter((day) => getHabitData(day.date)[habit.id]).length;
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300 } }}
                className={`bg-gradient-to-br ${habit.gradient} text-white rounded-3xl p-5 shadow-lg`}
              >
                <div className="text-3xl mb-2">{habit.emoji}</div>
                <div className="text-3xl font-bold">{count}</div>
                <div className="text-xs opacity-80 mt-0.5">out of 7 days</div>
                <div className="mt-3 h-1.5 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / 7) * 100}%` }}
                    transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
