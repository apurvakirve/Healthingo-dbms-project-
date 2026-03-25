export interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export const modules: Module[] = [
  {
    id: 'nutrition-basics',
    title: 'Nutrition Basics',
    description: 'Learn the fundamentals of nutrition and healthy eating',
    icon: '🍎',
    lessons: [
      {
        id: 'lesson-1',
        title: 'What is Nutrition?',
        content: 'Nutrition is the biochemical and physiological process by which an organism uses food to support its life. It provides organisms with nutrients, which can be metabolized to create energy and chemical structures. Failure to obtain sufficient nutrients causes malnutrition. Nutritional science is the study of nutrition, though it typically emphasizes human nutrition. In humans, nutrition is a fundamental pillar of health. A well-balanced diet provides the essential vitamins, minerals, and calories needed to fuel daily activities and maintain vital organ functions. Beyond just energy, nutrition plays a critical role in cellular repair, immune system strength, and the prevention of chronic illnesses such as heart disease, diabetes, and certain types of cancer.',
        order: 1,
      },
      {
        id: 'lesson-2',
        title: 'Importance of Balanced Diet',
        content: 'A balanced diet is one that fulfills all of a person\'s nutritional needs without going over the recommended daily calorie intake. By eating a balanced diet, people can get the nutrients and energy they need to work and enjoy life. A balanced diet typically includes a mix of five food groups: vegetables, fruits, grains, proteins, and dairy. Each group provides different essential nutrients, such as fiber, vitamins, and minerals. Balancing these groups ensures that the body receives a broad spectrum of nourishment. For instance, fruits and vegetables are rich in antioxidants, while proteins are essential for muscle repair and hormone production. Maintaining this balance is key to preventing deficiencies and supporting long-term health.',
        order: 2,
      },
      {
        id: 'lesson-3',
        title: 'Food Groups',
        content: 'The five main food groups are the building blocks of a healthy diet. 1. Fruits: Rich in vitamins and fiber. 2. Vegetables: Provide essential minerals and antioxidants. 3. Grains: Source of energy and B-vitamins, especially whole grains. 4. Protein: Essential for growth and repair, including meat, fish, beans, and nuts. 5. Dairy: Crucial for bone health through calcium and vitamin D. Understanding these groups allows for variety in meal planning, ensuring that you don\'t rely on a single source of nutrition. Diversifying your plate not only makes meals more interesting but also guarantees a more complete intake of the micronutrients your body craves for peak performance.',
        order: 3,
      },
      {
        id: 'lesson-4',
        title: 'Reading Nutrition Labels',
        content: 'Nutrition labels, or "Nutrition Facts" panels, are mandatory on most packaged foods and are a vital tool for making informed choices. They provide information on serving sizes, calories, and the amounts of various nutrients like fats, cholesterol, sodium, carbohydrates, and proteins. One key element is the % Daily Value (%DV), which tells you how much a nutrient in a serving of food contributes to a daily diet. Generally, 5% DV or less is considered low, while 20% DV or more is high. By comparing labels, you can choose foods that are lower in saturated fat, sodium, and added sugars, while being higher in fiber, vitamins, and minerals that support your health goals.',
        order: 4,
      },
      {
        id: 'lesson-5',
        title: 'Portion Control',
        content: 'Portion control is the practice of understanding how much food is being consumed and ensuring it aligns with your energy needs. It differs from serving size, which is a standardized amount found on nutrition labels. Effective portion control strategies include using smaller plates, measuring servings with common objects (e.g., a deck of cards for protein), and being mindful of hunger cues. Overeating, even of healthy foods, can lead to weight gain and metabolic strain. By mastering portions, you can enjoy a variety of foods without over-consuming calories, making it easier to maintain a healthy weight and sustain energy levels throughout the day.',
        order: 5,
      },
    ],
  },
  {
    id: 'balanced-diet',
    title: 'Balanced Diet',
    description: 'Discover how to create balanced meals for optimal health',
    icon: '⚖️',
    lessons: [
      {
        id: 'lesson-1',
        title: 'The Plate Method',
        content: 'The plate method is a simple way to create balanced meals. Fill half your plate with vegetables and fruits, one quarter with lean protein, and one quarter with whole grains. This visual guide helps ensure proper proportions.',
        order: 1,
      },
      {
        id: 'lesson-2',
        title: 'Meal Planning Basics',
        content: 'Effective meal planning saves time, money, and helps maintain a healthy diet. Learn to plan weekly menus, prepare shopping lists, and batch cook for success.',
        order: 2,
      },
      {
        id: 'lesson-3',
        title: 'Healthy Snacking',
        content: 'Snacks can be part of a healthy diet when chosen wisely. Opt for nutrient-dense options like fruits, vegetables with hummus, nuts, or yogurt instead of processed snacks.',
        order: 3,
      },
      {
        id: 'lesson-4',
        title: 'Eating Out Smartly',
        content: 'Learn strategies for making healthy choices when dining out. Tips include checking nutrition information, choosing grilled over fried, and being mindful of portion sizes.',
        order: 4,
      },
      {
        id: 'lesson-5',
        title: 'Budget-Friendly Nutrition',
        content: 'Eating healthy doesn\'t have to be expensive. Learn to choose affordable nutritious foods, shop seasonally, and minimize food waste.',
        order: 5,
      },
    ],
  },
  {
    id: 'macronutrients',
    title: 'Macronutrients',
    description: 'Understanding proteins, carbohydrates, and fats',
    icon: '💪',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Introduction to Macronutrients',
        content: 'Macronutrients are nutrients that provide energy and are needed in large amounts. The three main macronutrients are carbohydrates, proteins, and fats. Each plays a vital role in your body.',
        order: 1,
      },
      {
        id: 'lesson-2',
        title: 'Carbohydrates: Your Body\'s Fuel',
        content: 'Carbohydrates are the body\'s primary energy source. Learn about simple vs. complex carbs, the importance of fiber, and how to choose healthy carbohydrate sources.',
        order: 2,
      },
      {
        id: 'lesson-3',
        title: 'Proteins: Building Blocks',
        content: 'Proteins are essential for building and repairing tissues, making enzymes and hormones. Learn about complete and incomplete proteins, and how much protein you need daily.',
        order: 3,
      },
      {
        id: 'lesson-4',
        title: 'Fats: The Good and The Bad',
        content: 'Not all fats are created equal. Learn to distinguish between healthy unsaturated fats and less healthy saturated and trans fats. Understand their role in your diet.',
        order: 4,
      },
      {
        id: 'lesson-5',
        title: 'Balancing Your Macros',
        content: 'Learn how to balance your macronutrient intake based on your health goals, activity level, and individual needs. Discover the ideal ratios for different objectives.',
        order: 5,
      },
    ],
  },
  {
    id: 'micronutrients',
    title: 'Micronutrients',
    description: 'Essential vitamins and minerals for health',
    icon: '💊',
    lessons: [
      {
        id: 'lesson-1',
        title: 'What are Micronutrients?',
        content: 'Micronutrients are vitamins and minerals needed in small amounts but essential for proper body function, growth, and disease prevention.',
        order: 1,
      },
      {
        id: 'lesson-2',
        title: 'Essential Vitamins',
        content: 'Learn about fat-soluble vitamins (A, D, E, K) and water-soluble vitamins (B-complex, C), their functions, and food sources.',
        order: 2,
      },
      {
        id: 'lesson-3',
        title: 'Important Minerals',
        content: 'Discover essential minerals like calcium, iron, zinc, and magnesium. Understand their roles and how to ensure adequate intake.',
        order: 3,
      },
      {
        id: 'lesson-4',
        title: 'Antioxidants',
        content: 'Learn about antioxidants and their role in protecting cells from damage. Discover the best food sources of antioxidants.',
        order: 4,
      },
      {
        id: 'lesson-5',
        title: 'Supplements: When Needed',
        content: 'Understand when supplementation might be necessary and how to choose quality supplements. Learn about potential interactions and risks.',
        order: 5,
      },
    ],
  },
  {
    id: 'healthy-habits',
    title: 'Healthy Eating Habits',
    description: 'Build sustainable healthy eating patterns',
    icon: '✨',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Mindful Eating',
        content: 'Mindful eating involves paying full attention to the eating experience. Learn to recognize hunger and fullness cues, eat without distractions, and savor your food.',
        order: 1,
      },
      {
        id: 'lesson-2',
        title: 'Hydration Matters',
        content: 'Water is essential for every body function. Learn how much water you need, signs of dehydration, and tips for staying hydrated throughout the day.',
        order: 2,
      },
      {
        id: 'lesson-3',
        title: 'Regular Meal Times',
        content: 'Eating at regular intervals helps maintain energy levels and prevents overeating. Learn to establish a consistent eating schedule.',
        order: 3,
      },
      {
        id: 'lesson-4',
        title: 'Managing Cravings',
        content: 'Understand why cravings occur and learn healthy strategies to manage them. Discover the difference between hunger and cravings.',
        order: 4,
      },
      {
        id: 'lesson-5',
        title: 'Building Lasting Habits',
        content: 'Learn how to create sustainable healthy eating habits through small, consistent changes. Understand behavior change strategies that work.',
        order: 5,
      },
    ],
  },
  {
    id: 'diet-goals',
    title: 'Diet for Different Health Goals',
    description: 'Tailored nutrition for your specific goals',
    icon: '🎯',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Nutrition for Weight Loss',
        content: 'Learn sustainable approaches to weight loss through balanced nutrition. Understand calorie deficits, maintaining muscle mass, and avoiding yo-yo dieting.',
        order: 1,
      },
      {
        id: 'lesson-2',
        title: 'Nutrition for Weight Gain',
        content: 'Discover how to gain weight healthily through nutrient-dense foods and appropriate calorie surplus. Focus on quality over quantity.',
        order: 2,
      },
      {
        id: 'lesson-3',
        title: 'Nutrition for Muscle Building',
        content: 'Learn optimal protein intake, timing strategies, and the role of carbohydrates and fats in muscle building. Understand the importance of recovery nutrition.',
        order: 3,
      },
      {
        id: 'lesson-4',
        title: 'Sports Nutrition',
        content: 'Discover how to fuel athletic performance through proper nutrition. Learn about pre-workout, during-workout, and post-workout nutrition strategies.',
        order: 4,
      },
      {
        id: 'lesson-5',
        title: 'Nutrition for Longevity',
        content: 'Learn about dietary patterns associated with longevity and disease prevention. Discover the Mediterranean diet, anti-inflammatory foods, and more.',
        order: 5,
      },
    ],
  },
];

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const quizzes: { [lessonId: string]: QuizQuestion[] } = {
  'nutrition-basics-lesson-1': [
    {
      id: 'q1',
      question: 'What is nutrition?',
      options: [
        'Only about losing weight',
        'The process by which our bodies obtain and use food',
        'Only eating vegetables',
        'Counting calories',
      ],
      correctAnswer: 1,
      explanation: 'Nutrition is the comprehensive process by which our bodies obtain and utilize food for growth, metabolism, and repair.',
    },
    {
      id: 'q2',
      question: 'Why is good nutrition important?',
      options: [
        'Only for athletes',
        'To look good',
        'Maintains health, reduces disease risk, and promotes well-being',
        'It is not important',
      ],
      correctAnswer: 2,
      explanation: 'Good nutrition is essential for maintaining overall health, reducing the risk of chronic diseases, and promoting general well-being.',
    },
    {
      id: 'q3',
      question: 'What does a balanced diet include?',
      options: [
        'Only proteins',
        'Only vegetables',
        'A variety of foods from all food groups',
        'Only fruits',
      ],
      correctAnswer: 2,
      explanation: 'A balanced diet includes a variety of foods from all food groups to ensure you receive all essential nutrients.',
    },
  ],
  'nutrition-basics-lesson-2': [
    {
      id: 'q1',
      question: 'What does a balanced diet provide?',
      options: [
        'Only vitamins',
        'All essential nutrients your body needs',
        'Only energy',
        'Only minerals',
      ],
      correctAnswer: 1,
      explanation: 'A balanced diet provides all the essential nutrients your body needs to function correctly.',
    },
    {
      id: 'q2',
      question: 'How many main food groups are there?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 2,
      explanation: 'There are five main food groups: fruits, vegetables, grains, proteins, and dairy.',
    },
  ],
};
