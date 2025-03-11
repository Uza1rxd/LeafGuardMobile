import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import Subscription from '../models/Subscription';

/**
 * Get subscription plans
 * @route GET /api/subscriptions/plans
 * @access Public
 */
export const getSubscriptionPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a real application, these would come from a database
    const plans = [
      {
        id: 'free',
        name: 'Free Plan',
        price: 0,
        features: [
          '5 disease scans per month',
          'Basic disease information',
          'Limited treatment recommendations'
        ]
      },
      {
        id: 'premium',
        name: 'Premium Plan',
        price: 9.99,
        features: [
          'Unlimited disease scans',
          'Detailed disease information',
          'Advanced treatment recommendations',
          'Environmental monitoring',
          'Priority support'
        ]
      }
    ];

    res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Get subscription plans error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching subscription plans',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * Subscribe to a plan
 * @route POST /api/subscriptions/subscribe
 * @access Private
 */
export const subscribeToPlan = async (req: Request, res: Response): Promise<void> => {
  const { planId, paymentId } = req.body;

  try {
    // Get user from database
    const user = await User.findById(req.user.id) as IUser | null;
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Validate plan ID
    if (planId !== 'premium') {
      res.status(400).json({ message: 'Invalid plan ID' });
      return;
    }

    // In a real application, you would:
    // 1. Verify the payment with a payment processor
    // 2. Create a subscription record in your database
    // 3. Update the user's subscription status

    // Calculate subscription end date (1 month from now)
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    // Create subscription record
    const subscription = await Subscription.create({
      user: user._id,
      plan: planId,
      startDate: new Date(),
      endDate,
      isActive: true,
      paymentId
    });

    // Update user's subscription status
    user.isSubscribed = true;
    user.subscriptionExpiry = endDate;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        subscription: {
          plan: subscription.plan,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          isActive: subscription.isActive
        },
        user: {
          isSubscribed: user.isSubscribed,
          subscriptionExpiry: user.subscriptionExpiry
        }
      }
    });
  } catch (error) {
    console.error('Subscribe to plan error:', error);
    res.status(500).json({ 
      message: 'Server error during subscription',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * Get subscription status
 * @route GET /api/subscriptions/status
 * @access Private
 */
export const getSubscriptionStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user from database
    const user = await User.findById(req.user.id) as IUser | null;
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get active subscription
    const subscription = await Subscription.findOne({
      user: user._id,
      isActive: true
    });

    res.status(200).json({
      success: true,
      data: {
        isSubscribed: user.isSubscribed,
        remainingFreeScans: user.remainingFreeScans,
        subscription: subscription ? {
          plan: subscription.plan,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          isActive: subscription.isActive
        } : null
      }
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching subscription status',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * Cancel subscription
 * @route POST /api/subscriptions/cancel
 * @access Private
 */
export const cancelSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user from database
    const user = await User.findById(req.user.id) as IUser | null;
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get active subscription
    const subscription = await Subscription.findOne({
      user: user._id,
      isActive: true
    });

    if (!subscription) {
      res.status(400).json({ message: 'No active subscription found' });
      return;
    }

    // In a real application, you would:
    // 1. Cancel the subscription with the payment processor
    // 2. Update the subscription record in your database
    // 3. Update the user's subscription status

    // Update subscription status
    subscription.isActive = false;
    await subscription.save();

    // Update user's subscription status
    user.isSubscribed = false;
    user.subscriptionExpiry = undefined;
    user.remainingFreeScans = 5; // Reset free scans
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: {
        isSubscribed: user.isSubscribed,
        remainingFreeScans: user.remainingFreeScans
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ 
      message: 'Server error during subscription cancellation',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}; 