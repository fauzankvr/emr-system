import mongoose, { Schema, Document, Types, model } from 'mongoose';
import { IMedicine, MedicineSchema } from './medicine.model';

interface ILabReport {
  name?: string;
  values?: string;
  reportDate?: Date;
  status?: string;
  reportImageUrl?: string;
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

export interface IPrescription extends Document {
  doctor: Types.ObjectId;
  patient: Types.ObjectId;
  medicines: IMedicineEntry[];
  diagnosis?: string;
  bookingNotes?: string;
  notes?: string;
  labReports?: ILabReport[];
  labTest?: string[];
  procedures?: {
    name: string;
    price: string;
  };
  referral?: string[];
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
    reportDate: {
      type: Date,
      default: Date.now,
      set: (v: any) => v === null ? Date.now() : v
    },

    status: { type: String, enum: ['Pending', 'Completed', 'In Progress'], default: 'Pending' },
    reportImageUrl: { type: String },
  },
  { _id: true } // Enable _id for subdocuments
);

const PrescriptionSchema = new Schema<IPrescription>(
  {
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    medicines: [
      {
        medicine: MedicineSchema,
        isTapering: { type: Boolean, default: false },
        dosage: { type: String },
        dosageAmount: { type: String },
        duration: { type: String },
        instructions: { type: String },
        // timing: { type: String },
        tapering: [TaperingScheduleSchema],
      },
    ],
    diagnosis: { type: String },
    bookingNotes: { type: String },
    notes: { type: String },
    labReports: [LabReportSchema],
    labTest: {
      type: [String],
      default: []
    },
    procedures: [{
      name: { type: String },
      price: { type: String }
    }],
     referral: {
      type: [String],
      default: []
    },
  },
  { timestamps: true }
);


export const Prescription = model<IPrescription>('Prescription', PrescriptionSchema);