import mongoose, { Document, Schema } from 'mongoose';

export interface IDosage extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const dosageSchema = new Schema<IDosage>(
  {
    name: {
      type: String,
      required: [true, 'Dosage name is required'],
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
dosageSchema.index({ name: 'text' });

export const Dosage = mongoose.model<IDosage>('Dosage', dosageSchema); 