import express from 'express';
import {
  checkIn,
  getMyStats,
  getLeaderboard,
  awardPoints,
} from '../controllers/gamificationController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/leaderboard', getLeaderboard);

// Member
router.post('/checkin', protect, checkIn);
router.get('/my-stats', protect, getMyStats);

// Admin
router.post('/award-points', protect, requireRole('admin'), awardPoints);

export default router;
