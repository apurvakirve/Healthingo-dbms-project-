import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavBar } from '../components/NavBar';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Calculator, Info, ArrowRight } from 'lucide-react';

interface BMICategory {
  category: string;
  range: string;
  color: string;
  bgColor: string;
  borderColor: string;
  emoji: string;
  advice: string;
  min: number;
  max: number;
}

const bmiCategories: BMICategory[] = [
  {
    category: 'Underweight',
    range: '< 18.5',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    emoji: '🌱',
    advice: 'Consider consulting a nutritionist to safely increase caloric intake with nutrient-dense foods.',
    min: 0,
    max: 18.5,
  },
  {
    category: 'Normal Weight',
    range: '18.5 – 24.9',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    emoji: '✅',
    advice: "Great job! Maintain your healthy weight through balanced nutrition and regular physical activity.",
    min: 18.5,
    max: 25,
  },
  {
    category: 'Overweight',
    range: '25 – 29.9',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    emoji: '⚠️',
    advice: 'Focus on portion control, whole foods, and increasing daily physical activity gradually.',
    min: 25,
    max: 30,
  },
  {
    category: 'Obese',
    range: '≥ 30',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    emoji: '🏥',
    advice: 'Please consult with a healthcare professional for a personalized plan to improve your health.',
    min: 30,
    max: 100,
  },
];

function getBMICategory(bmi: number): BMICategory {
  return bmiCategories.find((c) => bmi >= c.min && bmi < c.max) || bmiCategories[bmiCategories.length - 1];
}

function BMIGauge({ bmi, category }: { bmi: number; category: BMICategory }) {
  // Map BMI 10–40 to 0–100%
  const pct = Math.min(Math.max(((bmi - 10) / 30) * 100, 0), 100);

  const gaugeColors = [
    { stop: '0%', color: '#60a5fa' },
    { stop: '28%', color: '#22c55e' },
    { stop: '50%', color: '#facc15' },
    { stop: '100%', color: '#ef4444' },
  ];

  return (
    <div className="mb-6">
      {/* Gauge Bar */}
      <div className="relative h-4 rounded-full overflow-hidden mb-2"
        style={{ background: 'linear-gradient(to right, #60a5fa 0%, #22c55e 28%, #facc15 50%, #ef4444 100%)' }}
      >
        <motion.div
          className="absolute top-0 w-5 h-5 -mt-0.5 bg-white rounded-full shadow-lg border-2 border-gray-700 z-10 -translate-x-1/2"
          style={{ left: `${pct}%` }}
          initial={{ left: '0%' }}
          animate={{ left: `${pct}%` }}
          transition={{ duration: 1, delay: 0.2, type: 'spring', stiffness: 100 }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-500 px-1">
        <span>Underweight</span>
        <span>Normal</span>
        <span>Overweight</span>
        <span>Obese</span>
      </div>
    </div>
  );
}

export default function BMICalculatorPage() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateBMI = async () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      setIsCalculating(true);
      await new Promise((r) => setTimeout(r, 500));
      setBmi(w / (h * h));
      setIsCalculating(false);
    }
  };

  const category = bmi ? getBMICategory(bmi) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <NavBar />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">BMI Calculator</h1>
              <p className="text-gray-500 text-sm">Know your Body Mass Index</p>
            </div>
          </div>
        </motion.div>

        {/* Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-6"
        >
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="height">Height</Label>
              <div className="relative mt-1.5">
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="rounded-xl h-12 pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">cm</span>
              </div>
            </div>
            <div>
              <Label htmlFor="weight">Weight</Label>
              <div className="relative mt-1.5">
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="rounded-xl h-12 pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">kg</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(22,163,74,0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={calculateBMI}
            disabled={!height || !weight || isCalculating}
            className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {isCalculating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Calculator className="w-5 h-5" />
                Calculate My BMI
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {bmi !== null && category && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className={`rounded-3xl shadow-xl p-8 border-2 mb-6 ${category.bgColor} ${category.borderColor}`}
            >
              {/* Result Header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="text-5xl mb-3"
                >
                  {category.emoji}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-6xl font-bold text-gray-900 mb-1">{bmi.toFixed(1)}</div>
                  <div className={`text-2xl font-bold ${category.color}`}>{category.category}</div>
                </motion.div>
              </div>

              {/* Gauge */}
              <BMIGauge bmi={bmi} category={category} />

              {/* Category breakdown */}
              <div className="grid grid-cols-4 gap-2 mb-5">
                {bmiCategories.map((cat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className={`rounded-xl p-2.5 text-center text-xs border ${
                      category.category === cat.category
                        ? `${cat.bgColor} ${cat.borderColor} ring-2 ring-offset-1 ${cat.color.replace('text', 'ring')}`
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="text-base mb-0.5">{cat.emoji}</div>
                    <div className="font-semibold text-gray-800 leading-tight">{cat.category}</div>
                    <div className="text-gray-500">{cat.range}</div>
                  </motion.div>
                ))}
              </div>

              {/* Advice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/70 backdrop-blur rounded-2xl p-4"
              >
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{category.advice}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">🧮</span>
            What is BMI?
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            Body Mass Index (BMI) is calculated by dividing your weight in kilograms by the square of your height in meters.
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Formula</p>
            <p className="font-bold text-gray-800">BMI = weight (kg) ÷ height² (m²)</p>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Note: BMI is a useful screening tool but doesn't account for muscle mass, bone density, or age. Consult a healthcare professional for a comprehensive assessment.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
