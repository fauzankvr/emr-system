import { IDiagnosis, Diagnosis } from "../models/diagnosis.model";
import { ApiError } from "../utils/ApiError";

export class DiagnosisService {
  static async createDiagnosis(data: Partial<IDiagnosis>): Promise<IDiagnosis> {
    try {
      const existingDiagnosis = await Diagnosis.findOne({ name: data.name });
      if (existingDiagnosis) {
        throw new ApiError(400, "Diagnosis with this name already exists");
      }
      
      return await Diagnosis.create(data);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to create diagnosis");
    }
  }

  static async getAllDiagnoses(): Promise<IDiagnosis[]> {
    try {
      return await Diagnosis.find().sort({ name: 1 });
    } catch (error) {
      throw new ApiError(500, "Failed to fetch diagnoses");
    }
  }

  static async getDiagnosisById(id: string): Promise<IDiagnosis | null> {
    try {
      return await Diagnosis.findById(id);
    } catch (error) {
      throw new ApiError(500, "Failed to fetch diagnosis");
    }
  }

  static async updateDiagnosis(id: string, data: Partial<IDiagnosis>): Promise<IDiagnosis | null> {
    try {
      if (data.name) {
        const existingDiagnosis = await Diagnosis.findOne({ 
          name: data.name, 
          _id: { $ne: id } 
        });
        if (existingDiagnosis) {
          throw new ApiError(400, "Diagnosis with this name already exists");
        }
      }
      
      return await Diagnosis.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to update diagnosis");
    }
  }

  static async deleteDiagnosis(id: string): Promise<boolean> {
    try {
      const result = await Diagnosis.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new ApiError(500, "Failed to delete diagnosis");
    }
  }

  static async searchDiagnoses(query: string): Promise<IDiagnosis[]> {
    try {
      return await Diagnosis.find({
        name: { $regex: query, $options: 'i' }
      }).sort({ name: 1 });
    } catch (error) {
      throw new ApiError(500, "Failed to search diagnoses");
    }
  }
} 