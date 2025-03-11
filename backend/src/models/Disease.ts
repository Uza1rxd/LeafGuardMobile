import mongoose, { Document, Schema } from 'mongoose';

export interface IDisease extends Document {
  name: string;
  scientificName: string;
  description: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
  preventions: string[];
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const diseaseSchema = new Schema<IDisease>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    scientificName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    symptoms: {
      type: [String],
      required: true,
    },
    causes: {
      type: [String],
      default: [],
    },
    treatments: {
      type: [String],
      required: true,
    },
    preventions: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDisease>('Disease', diseaseSchema); 