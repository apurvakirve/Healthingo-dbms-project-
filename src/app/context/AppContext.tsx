import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface UserProfile {
  user_id: number;
  name: string;
  email: string;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  gender: string | null;
  health_goal: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface ModuleProgress {
  moduleId: string;
  completedLessons: string[];
  progress: number;
}

export interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  /** Calls POST /api/auth/login, stores JWT, updates state. Returns error message on failure. */
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  /** Calls POST /api/auth/register, stores JWT, updates state. Returns error message on failure. */
  register: (userData: {
    name: string;
    email: string;
    password: string;
    age?: number;
    height?: number;
    weight?: number;
    gender?: string;
    health_goal?: string;
  }) => Promise<string | null>;
  points: number;
  streak: number;
  badges: any[];
  moduleProgress: ModuleProgress[];
  completeLesson: (moduleId: string, lessonId: string) => void;
  habits: { [date: string]: { water: boolean; fruits: boolean; exercise: boolean } };
  updateHabit: (date: string, habit: 'water' | 'fruits' | 'exercise', value: boolean) => void;
  refreshStats: () => Promise<void>;
  addPoints: (amount: number) => void;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'healthingo_token';
const USER_KEY  = 'healthingo_user';

// ── Context ────────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Rehydrate from localStorage on mount
  const [token, setToken]       = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUserState]    = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? (JSON.parse(stored) as UserProfile) : null;
    } catch {
      return null;
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem(TOKEN_KEY));

  const [points, setPoints]           = useState(0);
  const [streak, setStreak]           = useState(0);
  const [badges, setBadges]           = useState([]);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([
    { moduleId: 'nutrition-basics', completedLessons: ['lesson-1', 'lesson-2'], progress: 40 },
    { moduleId: 'balanced-diet', completedLessons: [], progress: 0 },
  ]);
  const [habits, setHabits] = useState<{
    [date: string]: { water: boolean; fruits: boolean; exercise: boolean };
  }>({});

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const persistSession = (jwt: string, profile: UserProfile) => {
    localStorage.setItem(TOKEN_KEY, jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    setToken(jwt);
    setUserState(profile);
    setIsLoggedIn(true);
  };

  const setUser = (profile: UserProfile | null) => {
    if (profile) {
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    setUserState(profile);
  };

  const refreshStats = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/user/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPoints(data.stats.points);
        setStreak(data.stats.streak);
        setBadges(data.stats.badges);
      }
    } catch (err) {
      console.error('Failed to sync stats:', err);
    }
  };

  const fetchHabits = async () => {
    if (!token || !user) return;
    try {
      const res = await fetch(`${API_BASE}/habits/${user.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const habitMap: any = {};
        data.history.forEach((h: any) => {
          const date = h.log_date.split('T')[0];
          habitMap[date] = {
            water: !!h.water_intake,
            fruits: !!h.fruits_eaten,
            exercise: !!h.exercise_done,
          };
        });
        setHabits(habitMap);
      }
    } catch (err) {
      console.error('Failed to fetch habits:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      refreshStats();
      fetchHabits();
    }
  }, [isLoggedIn, token]);

  // ── Auth Actions ──────────────────────────────────────────────────────────────

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return data.message || 'Login failed. Please try again.';
      }

      persistSession(data.token, data.user as UserProfile);
      return null; // null = success
    } catch {
      return 'Cannot connect to server. Is the backend running?';
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUserState(null);
    setIsLoggedIn(false);
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    age?: number;
    height?: number;
    weight?: number;
    gender?: string;
    health_goal?: string;
  }): Promise<string | null> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          age: userData.age,
          height: userData.height,
          weight: userData.weight,
          gender: userData.gender,
          health_goal: userData.health_goal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return data.message || 'Registration failed. Please try again.';
      }

      // After registration, automatically log in to get a token
      return login(userData.email, userData.password);
    } catch {
      return 'Cannot connect to server. Is the backend running?';
    }
  };

  // ── Other Actions ─────────────────────────────────────────────────────────────

  const addPoints = (amount: number) => setPoints((prev) => prev + amount);

  const completeLesson = (moduleId: string, lessonId: string) => {
    // Lesson completion is now handled via the Quiz submission API
    // We just refresh stats here in case it was a content-only lesson (if any)
    refreshStats();
  };

  const updateHabit = async (
    date: string,
    habit: 'water' | 'fruits' | 'exercise',
    value: boolean
  ) => {
    // Optimization: Update UI immediately
    const currentHabitData = habits[date] || { water: false, fruits: false, exercise: false };
    const newHabitData = { ...currentHabitData, [habit]: value };
    
    setHabits(prev => ({ ...prev, [date]: newHabitData }));

    // Send to backend
    if (!token) return;
    try {
      await fetch(`${API_BASE}/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newHabitData,
          water_intake: newHabitData.water,
          fruits_eaten: newHabitData.fruits,
          exercise_done: newHabitData.exercise,
          date
        }),
      });
    } catch (err) {
      console.error('Failed to sync habit to backend:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        token,
        isLoggedIn,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        register,
        points,
        addPoints: () => {}, // Deprecated, backend handles it
        streak,
        badges,
        moduleProgress,
        completeLesson,
        habits,
        updateHabit,
        refreshStats
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
