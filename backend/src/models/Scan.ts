import mongoose, { Document, Schema } from 'mongoose';

export interface IScan extends Document {
  user: mongoose.Types.ObjectId;
  imageUrl: string;
  disease: string;
  confidence: number;
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

const scanSchema = new Schema<IScan>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    disease: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
    recommendations: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IScan>('Scan', scanSchema); 