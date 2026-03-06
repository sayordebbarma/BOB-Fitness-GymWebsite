import express from 'express';
import {
  getAllMembers,
  getMember,
  updateMember,
  deleteMember,
  getDashboardStats,
  assignMembership,
} from '../controllers/adminController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, requireRole('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/members', getAllMembers);
router.get('/members/:id', getMember);
router.put('/members/:id', updateMember);
router.delete('/members/:id', deleteMember);
router.post('/members/:id/assign-membership', assignMembership);

export default router;