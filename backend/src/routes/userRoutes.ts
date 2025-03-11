import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getUserProfile } from '../controllers/authController';
import { updateUserProfile, getUserScans } from '../controllers/userController';

const router = express.Router();

// User profile routes
router.route('/')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// User scan history route
router.get('/scans', protect, getUserScans);

export default router; 