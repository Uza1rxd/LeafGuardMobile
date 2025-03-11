import express, { Request, Response } from 'express';
import { registerUser, loginUser, forgotPassword } from '../controllers/authController';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

// Reset password route (placeholder for now)
router.post('/reset-password', (req: Request, res: Response): void => {
  res.json({ message: 'Reset password' });
});

export default router; 