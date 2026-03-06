import express from 'express';
import {
  getMemberships,
  getMembership,
  subscribeMembership,
  createMembership,
  deleteMembership,
} from '../controllers/membershipController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getMemberships);
router.get('/:id', getMembership);

// Member — must be logged in
router.post('/subscribe/:id', protect, subscribeMembership);

// Admin only
router.post('/', protect, requireRole('admin'), createMembership);
router.delete('/:id', protect, requireRole('admin'), deleteMembership);

export default router;