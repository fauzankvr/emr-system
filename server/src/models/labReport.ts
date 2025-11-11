import mongoose, { Schema, Document } from "mongoose";

export interface ILabReport{
  patient: {
    name: string;
    email: string;
    phone: string;
    gender: string;
    age: string;
    dob: Date;
    createdAt: Date;
    updatedAt: Date;
  };
  _id: string;
  prescriptionId: any;
  // reportIndex: number;
  name: string;
  values: string;
  reportDate: Date;
  reportImageUrl?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}


// const labReportSchema = new Schema<ILabReport>(
//   {
//     patientId: {
//       type: Schema.Types.ObjectId,
//       ref: "Patient",
//       required: true,
//     },
//     prescriptionId: {
//       type: Schema.Types.ObjectId,
//       ref: "Prescription",
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "completed"],
//       default: "pending",
//     },
//   },
//   { timestamps: true } // automatically adds createdAt & updatedAt
// );

// export const LabReport = mongoose.model<ILabReport>("LabReport", labReportSchema);
