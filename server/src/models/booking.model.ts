import { Schema, model, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  bookingDate: Date;
  appointmentDate: Date;
  timeSlot: string;
  status: 'booked' | 'cancelled' | 'completed';
  prescription?: Types.ObjectId;
  reason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    prescription: { type: Schema.Types.ObjectId, ref: "Prescription" },
    bookingDate: { type: Date, default: Date.now },
    appointmentDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ["booked", "cancelled", "completed"],
      default: "booked",
    },
    reason: { type: String },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export const BookingModel = model<IBooking>('Booking', bookingSchema);
