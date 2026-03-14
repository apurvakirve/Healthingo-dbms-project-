import { createBrowserRouter } from 'react-router';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ModulesPage from './pages/ModulesPage';
import LessonPathPage from './pages/LessonPathPage';
import LessonContentPage from './pages/LessonContentPage';
import QuizPage from './pages/QuizPage';
import BMICalculatorPage from './pages/BMICalculatorPage';
import HabitsPage from './pages/HabitsPage';
import AdminPage from './pages/AdminPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/register',
    Component: RegisterPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/dashboard',
    Component: DashboardPage,
  },
  {
    path: '/modules',
    Component: ModulesPage,
  },
  {
    path: '/modules/:moduleId',
    Component: LessonPathPage,
  },
  {
    path: '/modules/:moduleId/lessons/:lessonId',
    Component: LessonContentPage,
  },
  {
    path: '/modules/:moduleId/lessons/:lessonId/quiz',
    Component: QuizPage,
  },
  {
    path: '/bmi-calculator',
    Component: BMICalculatorPage,
  },
  {
    path: '/habits',
    Component: HabitsPage,
  },
  {
    path: '/admin',
    Component: AdminPage,
  },
]);
