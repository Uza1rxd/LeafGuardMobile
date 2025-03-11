import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Disease from '../models/Disease';
import connectDB from '../config/database';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Sample disease data
const diseases = [
  {
    name: 'Leaf Spot',
    scientificName: 'Cercospora spp.',
    description: 'A common fungal disease that affects many plants, causing circular spots on leaves.',
    symptoms: [
      'Brown or black circular spots on leaves',
      'Yellowing around spots',
      'Leaf drop in severe cases'
    ],
    causes: [
      'Fungal infection',
      'Wet conditions',
      'Poor air circulation'
    ],
    treatments: [
      'Apply fungicide',
      'Remove affected leaves',
      'Improve air circulation'
    ],
    preventions: [
      'Avoid overhead watering',
      'Space plants properly',
      'Clean up fallen leaves'
    ],
    imageUrl: '/uploads/leaf-spot.jpg'
  },
  {
    name: 'Powdery Mildew',
    scientificName: 'Erysiphales',
    description: 'A fungal disease that appears as white powdery spots on leaves and stems.',
    symptoms: [
      'White powdery spots on leaves and stems',
      'Distorted leaves',
      'Stunted growth'
    ],
    causes: [
      'Fungal infection',
      'High humidity',
      'Poor air circulation'
    ],
    treatments: [
      'Apply fungicide',
      'Remove affected parts',
      'Improve air circulation'
    ],
    preventions: [
      'Space plants properly',
      'Avoid overhead watering',
      'Use resistant varieties'
    ],
    imageUrl: '/uploads/powdery-mildew.jpg'
  },
  {
    name: 'Rust',
    scientificName: 'Pucciniales',
    description: 'A fungal disease that causes rusty spots on leaves and stems.',
    symptoms: [
      'Rusty orange or brown spots on leaves',
      'Powdery spores on leaf undersides',
      'Leaf drop in severe cases'
    ],
    causes: [
      'Fungal infection',
      'Wet conditions',
      'Overcrowding'
    ],
    treatments: [
      'Apply fungicide',
      'Remove affected parts',
      'Improve air circulation'
    ],
    preventions: [
      'Avoid overhead watering',
      'Space plants properly',
      'Clean up fallen leaves'
    ],
    imageUrl: '/uploads/rust.jpg'
  }
];

// Sample admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@leafguard.com',
  password: 'password123',
  role: 'Admin',
  isSubscribed: true,
  remainingFreeScans: 999
};

// Seed data function
const seedData = async () => {
  try {
    // Clear existing data
    await Disease.deleteMany({});
    console.log('Diseases cleared');

    // Insert diseases
    await Disease.insertMany(diseases);
    console.log('Diseases seeded');

    // Check if admin user exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (!existingAdmin) {
      // Create admin user
      await User.create(adminUser);
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Data seeding completed');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData(); 