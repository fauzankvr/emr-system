import { Schema, model, Document } from 'mongoose';

export interface IMedicine extends Document {
  name: string;
  content: string;
  dosageForm: string;
}

export const MedicineSchema = new Schema<IMedicine>(
  {
    name: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    dosageForm: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Medicine = model<IMedicine>('Medicine', MedicineSchema);
