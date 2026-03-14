import { Link } from 'react-router';
import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Brain, Target, Award, TrendingUp, ArrowRight, Sparkles, Users, BookOpen, Star } from 'lucide-react';

const floatingFoods = ['🍎', '🥦', '🥕', '🍇', '🥑', '🍊', '🥗', '🫐', '🍓', '🥝'];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50 overflow-hidden">
      {/* Floating Food Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {floatingFoods.map((food, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl select-none opacity-10"
            style={{
              left: `${(i * 97 + 5) % 95}%`,
              top: `${(i * 83 + 10) % 90}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.08, 0.14, 0.08],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          >
            {food}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-3xl">🥗</span>
            <span className="text-2xl font-bold text-green-600">healthingo</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link
              to="/login"
              className="px-4 py-2 text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Login
            </Link>
            <Link to="/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors"
              >
                Get Started
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 pt-16 pb-24">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-2 mb-6 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            The fun way to learn nutrition
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-2 leading-tight">
              Master{' '}
              <span className="relative">
                <span className="text-green-600">Nutrition</span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-green-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                />
              </span>
            </h1>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Through Play
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            Bite-sized lessons, fun quizzes, and daily habits that stick — 
            your Duolingo-style journey to a healthier you
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/register">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(22,163,74,0.3)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-full font-semibold text-lg shadow-lg cursor-pointer"
              >
                Start for Free
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Link>
            <Link to="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 border-2 border-green-600 text-green-600 rounded-full font-semibold text-lg hover:bg-green-50 transition-colors cursor-pointer"
              >
                I have an account
              </motion.div>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex items-center justify-center gap-2 text-gray-500 text-sm"
          >
            <div className="flex -space-x-2">
              {['🧑', '👩', '👨', '🧕', '🧑‍🦱'].map((emoji, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-white border-2 border-green-200 flex items-center justify-center text-base shadow-sm"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <span>Join <strong className="text-gray-700">12,000+</strong> learners today</span>
          </motion.div>
        </div>

        {/* Floating app preview cards */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { emoji: '🔥', title: '7 Day Streak!', sub: 'Keep it going!', bg: 'from-orange-400 to-red-500', delay: 0 },
            { emoji: '⭐', title: '250 Points', sub: 'Earned this week', bg: 'from-yellow-400 to-orange-400', delay: 0.1 },
            { emoji: '📈', title: '40% Progress', sub: 'Nutrition Basics', bg: 'from-green-500 to-emerald-600', delay: 0.2 },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`bg-gradient-to-br ${card.bg} text-white rounded-3xl p-6 shadow-xl cursor-default`}
              style={{ animationDelay: `${card.delay}s` }}
            >
              <div className="text-4xl mb-3">{card.emoji}</div>
              <div className="font-bold text-xl">{card.title}</div>
              <div className="text-sm opacity-80 mt-1">{card.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.div
        className="relative z-10 bg-green-600 text-white py-16"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 12000, suffix: '+', label: 'Learners', icon: '👥' },
              { value: 6, suffix: '', label: 'Modules', icon: '📚' },
              { value: 30, suffix: '+', label: 'Lessons', icon: '📖' },
              { value: 98, suffix: '%', label: 'Satisfaction', icon: '⭐' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-green-200 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Healthingo?</h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">Everything you need to build lasting healthy eating habits</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Brain,
              emoji: '🧠',
              title: 'Interactive Lessons',
              desc: 'Learn nutrition through engaging, bite-sized lessons designed for real retention',
              bg: 'bg-green-50',
              iconBg: 'bg-green-100',
              iconColor: 'text-green-600',
              delay: 0,
            },
            {
              icon: Target,
              emoji: '🎯',
              title: 'Personalized Goals',
              desc: 'Set and track your unique health objectives tailored to your lifestyle',
              bg: 'bg-blue-50',
              iconBg: 'bg-blue-100',
              iconColor: 'text-blue-600',
              delay: 0.1,
            },
            {
              icon: Award,
              emoji: '🏆',
              title: 'Earn Rewards',
              desc: 'Collect points, badges, and streaks to stay motivated on your journey',
              bg: 'bg-yellow-50',
              iconBg: 'bg-yellow-100',
              iconColor: 'text-yellow-600',
              delay: 0.2,
            },
            {
              icon: TrendingUp,
              emoji: '📊',
              title: 'Track Progress',
              desc: 'Monitor your learning journey and healthy habits with beautiful visuals',
              bg: 'bg-purple-50',
              iconBg: 'bg-purple-100',
              iconColor: 'text-purple-600',
              delay: 0.3,
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300 } }}
                className={`${feature.bg} rounded-3xl p-6 cursor-default`}
              >
                <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="relative z-10 bg-gray-950 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400">Three simple steps to a healthier you</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-green-500 to-green-400 opacity-30" />
            
            {[
              { step: '01', emoji: '📚', title: 'Choose Your Path', desc: 'Pick from 6 nutrition modules based on your goals and interests', color: 'text-green-400' },
              { step: '02', emoji: '✍️', title: 'Learn & Quiz', desc: 'Complete bite-sized lessons then test your knowledge with instant feedback', color: 'text-blue-400' },
              { step: '03', emoji: '🏆', title: 'Track & Grow', desc: 'Earn points, maintain streaks, and build life-changing habits', color: 'text-yellow-400' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <span className="text-4xl">{step.emoji}</span>
                </div>
                <div className={`text-sm font-bold mb-2 ${step.color}`}>{step.step}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-3xl p-12 max-w-3xl mx-auto shadow-2xl"
        >
          <div className="text-5xl mb-4">🌱</div>
          <h2 className="text-4xl font-bold mb-4">Ready to start your journey?</h2>
          <p className="text-green-100 text-lg mb-8">Join thousands making healthier choices every day</p>
          <Link to="/register">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg cursor-pointer shadow-lg"
            >
              Start Learning — It's Free!
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t py-8 text-center text-gray-400 text-sm">
        <p>© 2026 healthingo — Your diet literacy companion</p>
      </div>
    </div>
  );
}
