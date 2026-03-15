import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { NavBar } from '../components/NavBar';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { BookOpen, FileQuestion, HelpCircle, Plus, CheckCircle, ShieldCheck, ChevronRight, ShieldX } from 'lucide-react';

type TabType = 'modules' | 'lessons' | 'quizzes';

const tabs: { id: TabType; label: string; icon: React.ElementType; emoji: string }[] = [
  { id: 'modules', label: 'Modules', icon: BookOpen, emoji: '📚' },
  { id: 'lessons', label: 'Lessons', icon: FileQuestion, emoji: '📖' },
  { id: 'quizzes', label: 'Quizzes', icon: HelpCircle, emoji: '❓' },
];

function SuccessToast({ message, onDone }: { message: string; onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
    >
      <CheckCircle className="w-5 h-5" />
      <span className="font-medium">{message}</span>
    </motion.div>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin, isLoggedIn, token } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('modules');
  const [toast, setToast] = useState<string | null>(null);
  const [modulesList, setModulesList] = useState<any[]>([]);

  // Redirect non-admin or unauthenticated users immediately
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    // Load modules list for sidebar
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    fetch(`${API_BASE}/modules`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setModulesList(data.modules || []))
      .catch(() => {});
  }, [isAdmin, isLoggedIn, navigate, token]);

  const [moduleForm, setModuleForm] = useState({ title: '', description: '', icon: '' });
  const [lessonForm, setLessonForm] = useState({ moduleId: '', title: '', content: '' });
  const [quizForm, setQuizForm] = useState({
    lessonId: '', question: '',
    option1: '', option2: '', option3: '', option4: '',
    correctAnswer: '1',
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Module created! (Demo mode)');
    setModuleForm({ title: '', description: '', icon: '' });
  };

  const handleLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Lesson created! (Demo mode)');
    setLessonForm({ moduleId: '', title: '', content: '' });
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Quiz question added! (Demo mode)');
    setQuizForm({ lessonId: '', question: '', option1: '', option2: '', option3: '', option4: '', correctAnswer: '1' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <NavBar />

      <AnimatePresence>
        {toast && <SuccessToast message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-500 text-sm">Manage your learning content</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-3"
          >
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
              <div className="text-2xl mb-1">📚</div>
              <div className="text-2xl font-bold text-gray-900">{modulesList.length}</div>
              <div className="text-sm text-gray-500">Modules</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
              <div className="text-2xl mb-1">📖</div>
              <div className="text-2xl font-bold text-gray-900">
                {modulesList.reduce((s: number, m: any) => s + (m.lesson_count || 0), 0)}
              </div>
              <div className="text-sm text-gray-500">Total Lessons</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
              <div className="text-2xl mb-1">❓</div>
              <div className="text-2xl font-bold text-gray-900">5</div>
              <div className="text-sm text-gray-500">Quiz Questions</div>
            </div>

            {/* Module List */}
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
              <div className="text-xs font-semibold text-gray-400 uppercase mb-3">Modules</div>
              <div className="space-y-2">
                {modulesList.map((m: any) => (
                  <div key={m.module_id} className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{m.icon || '📚'}</span>
                    <span className="truncate">{m.title}</span>
                    <ChevronRight className="w-3 h-3 text-gray-400 ml-auto flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3"
          >
            {/* Tab Bar */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-2xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>{tab.emoji}</span>
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'modules' && (
                <motion.div
                  key="modules"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-3xl shadow-lg p-8"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                      <Plus className="w-4 h-4 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Add New Module</h2>
                  </div>

                  <form onSubmit={handleModuleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="module-title">Module Title</Label>
                      <Input
                        id="module-title"
                        placeholder="e.g., Nutrition Basics"
                        value={moduleForm.title}
                        onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                        required
                        className="mt-1.5 rounded-xl h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="module-desc">Description</Label>
                      <Textarea
                        id="module-desc"
                        placeholder="Brief description of the module..."
                        value={moduleForm.description}
                        onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                        required
                        className="mt-1.5 rounded-xl"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="module-icon">Icon (Emoji)</Label>
                      <Input
                        id="module-icon"
                        placeholder="🍎"
                        value={moduleForm.icon}
                        onChange={(e) => setModuleForm({ ...moduleForm, icon: e.target.value })}
                        required
                        className="mt-1.5 rounded-xl h-11 text-2xl"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      Create Module
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {activeTab === 'lessons' && (
                <motion.div
                  key="lessons"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-3xl shadow-lg p-8"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Plus className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Add New Lesson</h2>
                  </div>

                  <form onSubmit={handleLessonSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="lesson-module">Module</Label>
                      <select
                        id="lesson-module"
                        value={lessonForm.moduleId}
                        onChange={(e) => setLessonForm({ ...lessonForm, moduleId: e.target.value })}
                        required
                        className="mt-1.5 w-full rounded-xl h-11 border border-gray-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select a module...</option>
                        {modulesList.map((m: any) => (
                          <option key={m.module_id} value={m.module_id}>
                            {m.icon || '📚'} {m.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="lesson-title">Lesson Title</Label>
                      <Input
                        id="lesson-title"
                        placeholder="e.g., What is Nutrition?"
                        value={lessonForm.title}
                        onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                        required
                        className="mt-1.5 rounded-xl h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lesson-content">Lesson Content</Label>
                      <Textarea
                        id="lesson-content"
                        placeholder="Write educational content for this lesson..."
                        value={lessonForm.content}
                        onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                        required
                        className="mt-1.5 rounded-xl"
                        rows={6}
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      Create Lesson
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {activeTab === 'quizzes' && (
                <motion.div
                  key="quizzes"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-3xl shadow-lg p-8"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Plus className="w-4 h-4 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Add Quiz Question</h2>
                  </div>

                  <form onSubmit={handleQuizSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="quiz-lesson">Lesson ID</Label>
                      <Input
                        id="quiz-lesson"
                        placeholder="e.g., nutrition-basics-lesson-1"
                        value={quizForm.lessonId}
                        onChange={(e) => setQuizForm({ ...quizForm, lessonId: e.target.value })}
                        required
                        className="mt-1.5 rounded-xl h-11"
                      />
                      <p className="text-xs text-gray-400 mt-1">Format: moduleId-lessonId</p>
                    </div>
                    <div>
                      <Label htmlFor="quiz-question">Question</Label>
                      <Input
                        id="quiz-question"
                        placeholder="What is the role of carbohydrates?"
                        value={quizForm.question}
                        onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })}
                        required
                        className="mt-1.5 rounded-xl h-11"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {(['option1', 'option2', 'option3', 'option4'] as const).map((opt, i) => (
                        <div key={opt}>
                          <Label htmlFor={opt}>
                            <span className="w-5 h-5 rounded-lg bg-gray-100 inline-flex items-center justify-center text-xs font-bold mr-1">
                              {String.fromCharCode(65 + i)}
                            </span>
                            Option {i + 1}
                          </Label>
                          <Input
                            id={opt}
                            value={quizForm[opt]}
                            onChange={(e) => setQuizForm({ ...quizForm, [opt]: e.target.value })}
                            required
                            className="mt-1.5 rounded-xl h-10"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <Label>Correct Answer</Label>
                      <div className="flex gap-2 mt-1.5">
                        {['1', '2', '3', '4'].map((n) => (
                          <motion.button
                            key={n}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setQuizForm({ ...quizForm, correctAnswer: n })}
                            className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                              quizForm.correctAnswer === n
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 text-gray-600 hover:border-green-300'
                            }`}
                          >
                            {String.fromCharCode(64 + parseInt(n))}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2 shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      Add Quiz Question
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Demo Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3"
            >
              <div className="text-xl flex-shrink-0">ℹ️</div>
              <div>
                <div className="font-semibold text-blue-800 text-sm">Demo Mode</div>
                <p className="text-xs text-blue-600 mt-0.5">
                  This is a prototype. In production, forms would persist data to a backend database.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
