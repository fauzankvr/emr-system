import mongoose, { Document, Schema } from 'mongoose';

export interface IInstruction extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const instructionSchema = new Schema<IInstruction>(
  {
    name: {
      type: String,
      required: [true, 'Instruction name is required'],
      trim: true,
      unique: true,
    },
    // description: {
    //   type: String,
    //   required: [true, 'Instruction description is required'],
    //   trim: true,
    // },
    // category: {
    //   type: String,
    //   trim: true,
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
instructionSchema.index({ name: 'text' });

export const Instruction = mongoose.model<IInstruction>('Instruction', instructionSchema); 