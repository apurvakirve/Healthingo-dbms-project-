import express from 'express';
import { getStatus } from '../controllers/statusController.js';

const router = express.Router();

// GET /api/status — health check
router.get('/status', getStatus);

export default router;
