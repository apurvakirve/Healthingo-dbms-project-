import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  height: number;
  weight: number;
  gender: string;
  healthGoal: string;
}

export interface ModuleProgress {
  moduleId: string;
  completedLessons: string[];
  progress: number;
}

export interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isLoggedIn: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (userData: UserProfile & { password: string }) => void;
  points: number;
  addPoints: (amount: number) => void;
  streak: number;
  moduleProgress: ModuleProgress[];
  completeLesson: (moduleId: string, lessonId: string) => void;
  habits: { [date: string]: { water: boolean; fruits: boolean; exercise: boolean } };
  updateHabit: (date: string, habit: 'water' | 'fruits' | 'exercise', value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [points, setPoints] = useState(250);
  const [streak, setStreak] = useState(7);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([
    { moduleId: 'nutrition-basics', completedLessons: ['lesson-1', 'lesson-2'], progress: 40 },
    { moduleId: 'balanced-diet', completedLessons: [], progress: 0 },
  ]);
  const [habits, setHabits] = useState<{ [date: string]: { water: boolean; fruits: boolean; exercise: boolean } }>({
    '2026-03-10': { water: true, fruits: true, exercise: true },
    '2026-03-11': { water: true, fruits: false, exercise: true },
    '2026-03-12': { water: true, fruits: true, exercise: false },
    '2026-03-13': { water: false, fruits: false, exercise: false },
  });

  const login = (email: string, password: string) => {
    // Mock login - in real app would validate credentials
    setIsLoggedIn(true);
    if (!user) {
      setUser({
        name: 'Demo User',
        email: email,
        age: 30,
        height: 170,
        weight: 70,
        gender: 'other',
        healthGoal: 'healthy-lifestyle',
      });
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const register = (userData: UserProfile & { password: string }) => {
    const { password, ...userProfile } = userData;
    setUser(userProfile);
    setIsLoggedIn(true);
  };

  const addPoints = (amount: number) => {
    setPoints((prev) => prev + amount);
  };

  const completeLesson = (moduleId: string, lessonId: string) => {
    setModuleProgress((prev) => {
      const moduleIndex = prev.findIndex((m) => m.moduleId === moduleId);
      if (moduleIndex === -1) {
        return [...prev, { moduleId, completedLessons: [lessonId], progress: 20 }];
      }
      
      const updated = [...prev];
      const module = updated[moduleIndex];
      if (!module.completedLessons.includes(lessonId)) {
        module.completedLessons = [...module.completedLessons, lessonId];
        module.progress = Math.min(100, module.progress + 20);
      }
      return updated;
    });
  };

  const updateHabit = (date: string, habit: 'water' | 'fruits' | 'exercise', value: boolean) => {
    setHabits((prev) => ({
      ...prev,
      [date]: {
        ...(prev[date] || { water: false, fruits: false, exercise: false }),
        [habit]: value,
      },
    }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        login,
        logout,
        register,
        points,
        addPoints,
        streak,
        moduleProgress,
        completeLesson,
        habits,
        updateHabit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
