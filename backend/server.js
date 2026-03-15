import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from backend/.env
dotenv.config();

// Initialize DB connection (tests connection on startup)
import './config/db.js';

// Import routes
import statusRoutes  from './routes/statusRoutes.js';
import authRoutes    from './routes/authRoutes.js';
import modulesRoutes from './routes/modulesRoutes.js';
import quizRoutes    from './routes/quizRoutes.js';
import healthRoutes  from './routes/healthRoutes.js';
import habitRoutes   from './routes/habitRoutes.js';
import userRoutes    from './routes/userRoutes.js';

// Import global error handler
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────

// CORS — allow requests from the Vite frontend (http://localhost:5173)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// ─── Routes ────────────────────────────────────────────────────────────────────

// Health check: GET /api/status
app.use('/api', statusRoutes);

// Auth: POST /api/auth/register  |  POST /api/auth/login
app.use('/api/auth', authRoutes);

// Modules: GET /api/modules  |  GET /api/modules/:id
app.use('/api/modules', modulesRoutes);

// Quiz & Lessons (Quiz): GET /api/lessons/:lessonId/quiz | POST /api/quiz/submit
app.use('/api', quizRoutes);

// Health (BMI): POST /api/health/bmi
app.use('/api/health', healthRoutes);

// Habits: POST /api/habits | GET /api/habits/:userId
app.use('/api/habits', habitRoutes);

// User Stats: GET /api/user/stats
app.use('/api/user', userRoutes);

// 404 fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found.` });
});

// Global error handler (must be last)
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Healthingo backend running at http://localhost:${PORT}`);
  console.log(`   Status check : http://localhost:${PORT}/api/status`);
  console.log(`   Register     : POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   Login        : POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   Modules      : GET  http://localhost:${PORT}/api/modules`);
  console.log(`   Frontend CORS: ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n`);
});

export default app;
