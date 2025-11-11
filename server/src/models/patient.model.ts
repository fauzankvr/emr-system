import mongoose, { Schema, model, Document } from 'mongoose';

export interface IVitals {
  spo2?: string;
  bp?: string;
  pulse?: string;
  temp?: string;
  weight?: string;
}

export interface IPatient extends Document {
  cardId: string;
  cardUrl: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: string;
  dob: Date;
  vitals?: IVitals;
  createdAt: Date;
  updatedAt: Date;
}

const vitalsSchema = new Schema<IVitals>({
  spo2: { type: String },
  bp: { type: String },
  pulse: { type: String },
  temp: { type: String },
  weight: { type: String },
}, { _id: false });

const patientSchema = new Schema<IPatient>(
  {
    cardId: { type: String, unique: true },
    cardUrl: { type: String},
    name: { type: String, required: true },
    email: { type: String},
    phone: { type: String, required: true},
    age: { type: String, required: true},
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    dob: { type: Date },
    vitals: vitalsSchema,
  },
  { timestamps: true }
);

export const PatientModel = model<IPatient>('Patient', patientSchema);
