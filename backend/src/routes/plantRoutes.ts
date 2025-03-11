import express, { Request, Response } from 'express';
import { protect } from '../middleware/authMiddleware';
import multer from 'multer';
import path from 'path';
import { detectDisease, getDiseases } from '../controllers/plantController';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

const router = express.Router();

// Plant disease detection endpoint
router.post('/predict', protect, upload.single('image'), detectDisease);

// Get plant diseases information
router.get('/diseases', getDiseases);

export default router; 