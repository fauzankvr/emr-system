import mongoose, { Schema, Document, Types, model } from 'mongoose';
import { IMedicine, MedicineSchema } from './medicine.model';

interface ILabReport {
  name?: string;
  values?: string;
  reportDate?: Date;
}

interface ITaperingSchedule {
  dosage: string;
  days: string;
}

interface IMedicineEntry {
  medicine: IMedicine;
  isTapering?: boolean;
  dosage: string;
  duration?: string;
  instructions?: string;
  timing?: string;
  tapering?: ITaperingSchedule[];
}

export interface ITemplate extends Document {
  doctor: Types.ObjectId;
  name: string;
  description?: string;
  medicines: IMedicineEntry[];
  diagnosis?: string;
  notes?: string;
  labReports?: ILabReport[];
  labTest?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TaperingScheduleSchema = new Schema<ITaperingSchedule>(
  {
    dosage: { type: String, required: true },
    days: { type: String, required: true },
  },
  { _id: false }
);

const LabReportSchema = new Schema<ILabReport>(
  {
    name: { type: String },
    values: { type: String },
    reportDate: { type: Date, default: Date.now },
  },
  { _id: false }
);

const TemplateSchema = new Schema<ITemplate>(
  {
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    name: { type: String, required: true },
    description: { type: String },
    medicines: [
      {
        medicine: MedicineSchema,
        isTapering: { type: Boolean, default: false },
        dosage: { type: String, required: true },
        duration: { type: String },
        instructions: { type: String },
        timing: { type: String },
        tapering: [TaperingScheduleSchema],
      },
    ],
    diagnosis: { type: String },
    notes: { type: String },
    labReports: [LabReportSchema],
    labTest: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Template = model<ITemplate>('Template', TemplateSchema); 