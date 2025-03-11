import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import generateToken from '../utils/generateToken';

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Farmer',
    }) as IUser;

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSubscribed: user.isSubscribed,
        remainingFreeScans: user.remainingFreeScans,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * Authenticate user & get token
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email }).select('+password') as IUser | null;

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSubscribed: user.isSubscribed,
        remainingFreeScans: user.remainingFreeScans,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id) as IUser | null;

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSubscribed: user.isSubscribed,
        remainingFreeScans: user.remainingFreeScans,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching profile',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * Forgot password
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal that the user doesn't exist for security
      res.status(200).json({ message: 'If your email is registered, you will receive a password reset link' });
      return;
    }

    // In a real application, you would:
    // 1. Generate a reset token
    // 2. Save it to the user record with an expiration
    // 3. Send an email with a link containing the token

    // For now, we'll just simulate success
    res.status(200).json({ message: 'If your email is registered, you will receive a password reset link' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      message: 'Server error during password reset request',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}; 