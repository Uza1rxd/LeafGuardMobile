import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import Scan from '../models/Scan';
import Disease from '../models/Disease';

/**
 * Detect plant disease from uploaded image
 * @route POST /api/plants/predict
 * @access Private
 */
export const detectDisease = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      res.status(400).json({ message: 'Please upload an image' });
      return;
    }

    // Get user from database
    const user = await User.findById(req.user.id) as IUser | null;
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if user has remaining scans (if not subscribed)
    if (!user.isSubscribed && user.remainingFreeScans <= 0) {
      res.status(403).json({ 
        message: 'You have used all your free scans. Please subscribe to continue.',
        remainingScans: 0
      });
      return;
    }

    // In a real application, you would:
    // 1. Process the image using a machine learning model
    // 2. Get the disease prediction and confidence score
    
    // For now, we'll use mock data
    const mockDiseases = [
      { name: 'Leaf Spot', confidence: 0.95 },
      { name: 'Powdery Mildew', confidence: 0.85 },
      { name: 'Rust', confidence: 0.75 }
    ];
    
    // Randomly select a disease
    const randomIndex = Math.floor(Math.random() * mockDiseases.length);
    const detectedDisease = mockDiseases[randomIndex];
    
    // Get disease details from database or use mock data
    const diseaseInfo = await Disease.findOne({ name: detectedDisease.name }) || {
      name: detectedDisease.name,
      scientificName: 'Scientific name placeholder',
      description: 'Description placeholder',
      symptoms: ['Symptom 1', 'Symptom 2'],
      treatments: ['Treatment 1', 'Treatment 2'],
      preventions: ['Prevention 1', 'Prevention 2']
    };

    // Create a new scan record
    const scan = await Scan.create({
      user: user._id,
      imageUrl: `/uploads/${req.file.filename}`,
      disease: detectedDisease.name,
      confidence: detectedDisease.confidence,
      recommendations: diseaseInfo.treatments
    });

    // Decrement remaining scans if user is not subscribed
    if (!user.isSubscribed) {
      user.remainingFreeScans -= 1;
      await user.save();
    }

    // Return the result
    res.status(200).json({
      success: true,
      data: {
        disease: detectedDisease.name,
        confidence: detectedDisease.confidence,
        description: diseaseInfo.description,
        symptoms: diseaseInfo.symptoms,
        recommendations: diseaseInfo.treatments,
        preventions: diseaseInfo.preventions,
        imageUrl: `/uploads/${req.file.filename}`,
        remainingScans: user.remainingFreeScans
      }
    });
  } catch (error) {
    console.error('Disease detection error:', error);
    res.status(500).json({ 
      message: 'Server error during disease detection',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * Get list of plant diseases
 * @route GET /api/plants/diseases
 * @access Public
 */
export const getDiseases = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get diseases from database or use mock data
    const diseases = await Disease.find() || [
      {
        id: '1',
        name: 'Leaf Spot',
        description: 'A common fungal disease that affects many plants',
        symptoms: ['Brown spots on leaves', 'Yellowing around spots', 'Leaf drop'],
        treatments: ['Apply fungicide', 'Remove affected leaves']
      },
      {
        id: '2',
        name: 'Powdery Mildew',
        description: 'A fungal disease that appears as white powdery spots',
        symptoms: ['White powdery spots', 'Distorted leaves', 'Stunted growth'],
        treatments: ['Apply fungicide', 'Improve air circulation']
      }
    ];

    res.status(200).json({
      success: true,
      data: diseases
    });
  } catch (error) {
    console.error('Get diseases error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching diseases',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}; 