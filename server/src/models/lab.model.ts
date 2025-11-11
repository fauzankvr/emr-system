import mongoose, { Schema, Document } from "mongoose";

export interface ILab extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const labSchema = new Schema<ILab>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

export const Lab = mongoose.model<ILab>("Lab", labSchema);
