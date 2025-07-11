import mongoose, { Schema, Document, Types, model } from 'mongoose';

interface ILabReport {
  name?: string;
  reportType?: string;
  findings?: string;
  values?: Record<string, string>;
  reportDate?: Date;
}

interface IVitals {
  spo2?: string;
  bp?: string;
  pulse?: string;
  temp?: string;
  weight?: string;
}

interface ITaperingSchedule {
  dosage: string;
  days: string;
}

interface IMedicineEntry {
  medicine: Types.ObjectId;
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
  notes?: string;
  labReports?: ILabReport[];
  vitals?: IVitals;
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
    reportType: { type: String },
    findings: { type: String },
    values: { type: Map, of: String },
    reportDate: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PrescriptionSchema = new Schema<IPrescription>(
  {
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    medicines: [
      {
        medicine: {
          type: Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
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
    vitals: {
      spo2: { type: String },
      bp: { type: String },
      pulse: { type: String },
      temp: { type: String },
      weight: { type: String },
    },
    labTest: { type: [String], default: [] },
  },
  { timestamps: true }
);


export const Prescription = model<IPrescription>('Prescription', PrescriptionSchema);