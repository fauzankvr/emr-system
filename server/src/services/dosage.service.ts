import { IDosage, Dosage } from "../models/dosage.model";
import { ApiError } from "../utils/ApiError";

export class DosageService {
  static async createDosage(data: Partial<IDosage>): Promise<IDosage> {
    try {
      const existingDosage = await Dosage.findOne(
        { name: data.name }
      );
      if (existingDosage) {
        throw new ApiError(400, "Dosage with this name already exists");
      }
      return await Dosage.create(data);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to create dosage");
    }
  }

  static async getAllDosages(): Promise<IDosage[]> {
    try {
      return await Dosage.find().sort({ name: 1 });
    } catch (error) {
      throw new ApiError(500, "Failed to fetch dosages");
    }
  }

  static async getDosageById(id: string): Promise<IDosage | null> {
    try {
      return await Dosage.findById(id);
    } catch (error) {
      throw new ApiError(500, "Failed to fetch dosage");
    }
  }

  static async updateDosage(id: string, data: Partial<IDosage>): Promise<IDosage | null> {
    try {
      if (data.name) {
        const existingDosage = await Dosage.findOne({ 
          name: data.name, 
          _id: { $ne: id } 
        });
        if (existingDosage) {
          throw new ApiError(400, "Dosage with this name already exists");
        }
      }
      
      return await Dosage.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to update dosage");
    }
  }

  static async deleteDosage(id: string): Promise<boolean> {
    try {
      const result = await Dosage.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new ApiError(500, "Failed to delete dosage");
    }
  }

  static async searchDosages(query: string): Promise<IDosage[]> {
    try {
      return await Dosage.find({
        name: { $regex: query, $options: 'i' }
      }).sort({ name: 1 });
    } catch (error) {
      throw new ApiError(500, "Failed to search dosages");
    }
  }
} 