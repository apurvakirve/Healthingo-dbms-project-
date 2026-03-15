import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ChevronRight, ChevronLeft, Check, User, Activity, Target, AlertCircle } from 'lucide-react';

const steps = [
  { id: 1, title: 'Your Identity', icon: User, desc: 'Tell us who you are' },
  { id: 2, title: 'Body Metrics', icon: Activity, desc: 'Help us personalize your experience' },
  { id: 3, title: 'Your Goals', icon: Target, desc: 'What do you want to achieve?' },
];

const healthGoalEmoji: Record<string, string> = {
  'weight-loss': '⚖️',
  'weight-gain': '💪',
  'muscle-gain': '🏋️',
  'healthy-lifestyle': '🌱',
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
    healthGoal: '',
  });

  const goToStep = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  const handleNext = () => {
    if (currentStep < 3) goToStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const err = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      age: formData.age ? parseInt(formData.age) : undefined,
      height: formData.height ? parseInt(formData.height) : undefined,
      weight: formData.weight ? parseInt(formData.weight) : undefined,
      gender: formData.gender || undefined,
      health_goal: formData.healthGoal || undefined,
    });

    setIsLoading(false);
    if (err) {
      setError(err);
    } else {
      navigate('/dashboard');
    }
  };

  const isStep1Valid = formData.name && formData.email && formData.password;
  const isStep2Valid = formData.age && formData.height && formData.weight && formData.gender;
  const isStep3Valid = formData.healthGoal;

  const stepVariants = {
    enter: (dir: number) => ({ x: dir * 80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -80, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <span className="text-4xl">🥗</span>
            <h1 className="text-4xl font-bold text-green-600">healthingo</h1>
          </Link>
          <p className="text-gray-500">Create your account — it takes under 2 minutes!</p>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center mb-8"
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            return (
              <div key={step.id} className="flex items-center">
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isCompleted ? '#16a34a' : isActive ? '#16a34a' : '#e5e7eb',
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-sm"
                  onClick={() => isCompleted && goToStep(step.id)}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  )}
                </motion.div>
                {i < steps.length - 1 && (
                  <motion.div
                    className="w-16 h-1 mx-1 rounded-full"
                    animate={{ backgroundColor: currentStep > step.id ? '#16a34a' : '#e5e7eb' }}
                  />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Step Label */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900">{steps[currentStep - 1].title}</h2>
          <p className="text-gray-500 text-sm mt-1">{steps[currentStep - 1].desc}</p>
        </motion.div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait" custom={direction}>
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="space-y-5"
                  >
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="e.g. Alex Johnson"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="mt-1 rounded-xl h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="mt-1 rounded-xl h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Create Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="At least 8 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        className="mt-1 rounded-xl h-12"
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="30"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          required
                          className="mt-1 rounded-xl h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="170"
                          value={formData.height}
                          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                          required
                          className="mt-1 rounded-xl h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="70"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          required
                          className="mt-1 rounded-xl h-12"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {[
                          { value: 'male', emoji: '👨', label: 'Male' },
                          { value: 'female', emoji: '👩', label: 'Female' },
                          { value: 'other', emoji: '🧑', label: 'Other' },
                        ].map((g) => (
                          <motion.button
                            key={g.value}
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setFormData({ ...formData, gender: g.value })}
                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                              formData.gender === g.value
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-green-300'
                            }`}
                          >
                            <div className="text-2xl mb-1">{g.emoji}</div>
                            <div className="text-sm font-medium text-gray-700">{g.label}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="space-y-4"
                  >
                    <p className="text-gray-600 text-sm mb-4">Choose your primary health goal:</p>
                    {[
                      { value: 'weight-loss', label: 'Lose Weight', desc: 'Shed extra pounds safely and sustainably', emoji: '⚖️' },
                      { value: 'weight-gain', label: 'Gain Weight', desc: 'Build mass with healthy nutrient-dense foods', emoji: '💪' },
                      { value: 'muscle-gain', label: 'Build Muscle', desc: 'Optimize protein and energy for strength', emoji: '🏋️' },
                      { value: 'healthy-lifestyle', label: 'Healthy Lifestyle', desc: 'Build balanced habits for overall wellness', emoji: '🌱' },
                    ].map((goal) => (
                      <motion.button
                        key={goal.value}
                        type="button"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, healthGoal: goal.value })}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                          formData.healthGoal === goal.value
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="text-3xl">{goal.emoji}</div>
                        <div>
                          <div className="font-semibold text-gray-900">{goal.label}</div>
                          <div className="text-sm text-gray-500">{goal.desc}</div>
                        </div>
                        {formData.healthGoal === goal.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-8">
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBack}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </motion.button>
                )}

                {currentStep < 3 ? (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    disabled={currentStep === 1 ? !isStep1Valid : !isStep2Valid}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold transition-colors"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!isStep3Valid || isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Creating account...
                      </>
                    ) : (
                      '🚀 Start My Journey!'
                    )}
                  </motion.button>
                )}
              </div>
            </form>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-8 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </motion.div>
          )}

          {/* Progress bar at bottom */}
          <div className="h-1.5 bg-gray-100">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
            Login here
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
