import { PatientModel, IPatient } from "../models/patient.model";

export class PatientService {
  static async createPatient(patientData: IPatient): Promise<IPatient> {
    try {
      if (!patientData.name || !patientData.age || !patientData.gender) {
        throw new Error("Missing required patient fields: name, age, or gender");
      }

      const newPatient = new PatientModel(patientData);
      await newPatient.save();
      return newPatient.toObject();
    } catch (error: any) {
      throw new Error(`Error creating patient: ${error.message}`);
    }
  }

  static async checkPatientExist(phone: string, email: string): Promise<boolean> {
    try {
      const existingPatient = await PatientModel.findOne({
        $or: [{ phone }, { email }]
      });
      return !!existingPatient;
    } catch (error: any) {
      throw new Error(`Error checking patient existence: ${error.message}`);
    }
  }

  static async getAllPatients(): Promise<IPatient[]> {
    try {
      return await PatientModel.find();
    } catch (error: any) {
      throw new Error(`Error fetching patients: ${error.message}`);
    }
  }

  static async getPatientById(id: string): Promise<IPatient | null> {
    try {
      const patient = await PatientModel.findById(id);
      if (!patient) throw new Error("Patient not found");
      return patient.toObject();
    } catch (error: any) {
      throw new Error(`Error fetching patient: ${error.message}`);
    }
  }

  static async updatePatient(id: string, updateData: Partial<IPatient>): Promise<IPatient> {
    try {
      const updated = await PatientModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) throw new Error("Patient not found");
      return updated.toObject();
    } catch (error: any) {
      throw new Error(`Error updating patient: ${error.message}`);
    }
  }

  static async updatePatientVitals(id: string, vitals: any): Promise<IPatient | null> {
    try {
      const updated = await PatientModel.findByIdAndUpdate(id, { vitals }, { new: true });
      return updated ? updated.toObject() : null;
    } catch (error: any) {
      throw new Error(`Error updating patient vitals: ${error.message}`);
    }
  }

  static async deletePatient(id: string): Promise<void> {
    try {
      const deleted = await PatientModel.findByIdAndDelete(id);
      if (!deleted) throw new Error("Patient not found");
    } catch (error: any) {
      throw new Error(`Error deleting patient: ${error.message}`);
    }
  }

  static async searchPatients(query: string): Promise<IPatient[]> {
    try {
      let value = query.toString();
      return await PatientModel.find({
        $or: [
          { name: { $regex: value, $options: "i" } },
          { email: { $regex: value, $options: "i" } },
          { phone: { $regex: value, $options: "i" } }
        ]
      });
    } catch (error: any) {
      throw new Error(`Error searching patients: ${error.message}`);
    }
  }
}
