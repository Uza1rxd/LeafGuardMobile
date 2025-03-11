import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import Scan from '../models/Scan';

/**
 * Update user profile
 * @route PUT /api/users
 * @access Private
 */
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id) as IUser | null;

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update user fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    
    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Save updated user
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isSubscribed: updatedUser.isSubscribed,
      remainingFreeScans: updatedUser.remainingFreeScans,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Server error while updating profile',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * Get user scan history
 * @route GET /api/users/scans
 * @access Private
 */
export const getUserScans = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get user's scan history
    const scans = await Scan.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: scans.length,
      data: scans
    });
  } catch (error) {
    console.error('Get scan history error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching scan history',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}; 