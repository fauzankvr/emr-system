import mongoose, { Document, Schema } from 'mongoose';

export interface IFrequency extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const frequencySchema = new Schema<IFrequency>(
  {
    name: {
      type: String,
      required: [true, 'Frequency name is required'],
      trim: true,
      unique: true,
    },
    // description: {
    //   type: String,
    //   required: [true, 'Frequency description is required'],
    //   trim: true,
    // },
    // code: {
    //   type: String,
    //   required: [true, 'Frequency code is required'],
    //   trim: true,
    //   unique: true,
    // },
    // isActive: {
    //   type: Boolean,
    //   default: true,
    // },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
frequencySchema.index({ name: 'text' });

export const Frequency = mongoose.model<IFrequency>('Frequency', frequencySchema); 