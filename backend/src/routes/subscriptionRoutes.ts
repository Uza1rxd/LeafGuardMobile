import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getSubscriptionPlans,
  subscribeToPlan,
  getSubscriptionStatus,
  cancelSubscription
} from '../controllers/subscriptionController';

const router = express.Router();

// Subscription routes
router.get('/plans', getSubscriptionPlans);
router.post('/subscribe', protect, subscribeToPlan);
router.get('/status', protect, getSubscriptionStatus);
router.post('/cancel', protect, cancelSubscription);

export default router; 