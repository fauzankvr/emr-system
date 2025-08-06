import { IPrescription, Prescription } from "../models/prescription.model"
import { Types } from "mongoose";
import { PatientModel } from "../models/patient.model";
import { prescriptionEmitter } from "../events/event/prescriptionEvents";
export class PrescriptionService {
  static async createPrescription(data: Partial<IPrescription>) {
    try {
      if (!data.doctor || !Types.ObjectId.isValid(data.doctor)) {
        throw new Error("Invalid or missing doctor ID.");
      }
      if (!data.patient || !Types.ObjectId.isValid(data.patient)) {
        throw new Error("Invalid or missing patient ID.");
      }

      // if (!Array.isArray(data.medicines) || data.medicines.length === 0) {
      //   throw new Error("At least one medicine is required.");
      // }

      // for (const [index, med] of data.medicines.entries()) {
      //   if (!med.medicine) {
      //     throw new Error(`Invalid medicine ID at index ${index}.`);
      //   }
      // }

      const patient = await PatientModel.findById(data.patient).select("email");
      if (!patient?.email) {
        throw new Error("Patient not found or email not registered.");
      }

      const newPrescription = new Prescription({
        doctor: data.doctor,
        patient: data.patient,
        medicines: data.medicines||[],
        diagnosis: data.diagnosis || "",
        bookingNotes: data.bookingNotes || "",
        notes: data.notes || "",
        labReports: data.labReports || [],
        labTest: data.labTest || "",
       
      });

      await newPrescription.save();

      const populatedPrescription = await Prescription.findById(
        newPrescription._id
      )
        .populate("doctor", "name specialization email phone")
        .populate("patient")
        .populate("medicines.medicine", "name");

      if (!populatedPrescription) {
        throw new Error("Failed to populate prescription details.");
      }
      const some = prescriptionEmitter.emit(
        "prescription:created",
        patient.email,
        populatedPrescription
      );
      console.log("some", some);
      return populatedPrescription;
    } catch (error: any) {
      console.log(error);
      throw new Error(`Failed to create prescription: ${error.message}`);
    }
  }              

  static async getAllPrescriptions() {
    return await Prescription.find().populate(
      "doctor patient medicines.medicine"
    );
  }

  static async getPrescriptionById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid prescription ID");
    return await Prescription.findById(id).populate(
      "doctor patient"
    );
  }

  static async getPrescriptionsByPatient(patientId: string) {
    if (!Types.ObjectId.isValid(patientId))
      throw new Error("Invalid patient ID");
    return await Prescription.find({ patient: patientId }).populate(
      "doctor patient"
    );
  }

  static async getPrescriptionsByDoctor(doctorId: string) {
    if (!Types.ObjectId.isValid(doctorId)) throw new Error("Invalid doctor ID");
    return await Prescription.find({ doctor: doctorId }).populate(
      "patient"
    );
  }

  static async updatePrescription(id: string, updates: Partial<IPrescription>) {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid prescription ID");
    return await Prescription.findByIdAndUpdate(id, updates, { new: true });
  }

  static async deletePrescription(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid prescription ID");
    return await Prescription.findByIdAndDelete(id);
  }

  // New method to save prescription without sending email
  static async savePrescription(data: Partial<IPrescription>) {
    try {
      if (!data.doctor || !Types.ObjectId.isValid(data.doctor)) {
        throw new Error("Invalid or missing doctor ID.");
      }
      if (!data.patient || !Types.ObjectId.isValid(data.patient)) {
        throw new Error("Invalid or missing patient ID.");
      }

      const newPrescription = new Prescription({
        doctor: data.doctor,
        patient: data.patient,
        medicines: data.medicines || [],
        bookingNotes: data.bookingNotes || "",
        diagnosis: data.diagnosis || "",
        notes: data.notes || "",
        labReports: data.labReports || [],
        labTest: data.labTest || "",
      });

      await newPrescription.save();

      const populatedPrescription = await Prescription.findById(
        newPrescription._id
      )
        .populate("doctor", "name specialization email phone")
        .populate("patient")
        .populate("medicines.medicine", "name");

      if (!populatedPrescription) {
        throw new Error("Failed to populate prescription details.");
      }

      return populatedPrescription;
    } catch (error: any) {
      console.log(error);
      throw new Error(`Failed to save prescription: ${error.message}`);
    }
  }

  // New method to send prescription email only
  static async sendPrescriptionEmail(prescriptionId: string) {
    try {
      if (!Types.ObjectId.isValid(prescriptionId)) {
        throw new Error("Invalid prescription ID.");
      }

      const prescription = await Prescription.findById(prescriptionId)
        .populate("doctor", "name specialization email phone")
        .populate("patient")
        .populate("medicines.medicine", "name");

      if (!prescription) {
        throw new Error("Prescription not found.");
      }

      const patient = await PatientModel.findById(prescription.patient).select("email");
      if (!patient?.email) {
        throw new Error("Patient not found or email not registered.");
      }

      const result = prescriptionEmitter.emit(
        "prescription:created",
        patient.email,
        prescription
      );

      return { success: true, message: "Email sent successfully", prescription };
    } catch (error: any) {
      console.log(error);
      throw new Error(`Failed to send prescription email: ${error.message}`);
    }
  }
}
