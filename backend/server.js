import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from backend/.env
dotenv.config();

// Initialize DB connection (tests connection on startup)
import './config/db.js';

// Import routes
import statusRoutes from './routes/statusRoutes.js';

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
  console.log(`   Frontend CORS: ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n`);
});

export default app;
