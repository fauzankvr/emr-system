import mongoose, { Document, Schema } from 'mongoose';

export interface IDiagnosis extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const diagnosisSchema = new Schema<IDiagnosis>(
  {
    name: {
      type: String,
      required: [true, 'Diagnosis name is required'],
      trim: true,
      unique: true,
    },
    // description: {
    //   type: String,
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
diagnosisSchema.index({ name: 'text' });

export const Diagnosis = mongoose.model<IDiagnosis>('Diagnosis', diagnosisSchema); 