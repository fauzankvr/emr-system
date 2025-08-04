import mongoose, { Document, Schema } from 'mongoose';

export interface IDays extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const daysSchema = new Schema<IDays>(
  {
    name: {
      type: String,
      required: [true, 'Days name is required'],
      trim: true,
      unique: true,
    },
    // description: {
    //   type: String,
    //   required: [true, 'Days description is required'],
    //   trim: true,
    // },
    // value: {
    //   type: Number,
    //   required: [true, 'Days value is required'],
    //   min: 1,
    // },
    // unit: {
    //   type: String,
    //   required: [true, 'Days unit is required'],
    //   enum: ['days', 'weeks', 'months'],
    //   default: 'days',
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
daysSchema.index({ name: 'text'});

export const Days = mongoose.model<IDays>('Days', daysSchema); 