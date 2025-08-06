import { IFrequency, Frequency } from "../models/frequency.model";
import { ApiError } from "../utils/ApiError";

export class FrequencyService {
  static async createFrequency(data: Partial<IFrequency>): Promise<IFrequency> {
    try {
      const existingFrequency = await Frequency.findOne(
    { name: data.name }
      );
      if (existingFrequency) {
        throw new ApiError(400, "Frequency with this name or code already exists");
      }
      return await Frequency.create(data);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to create frequency");
    }
  }

  static async getAllFrequencies(): Promise<IFrequency[]> {
    try {
      return await Frequency.find().sort({ name: 1 });
    } catch (error) {
      throw new ApiError(500, "Failed to fetch frequencies");
    }
  }

  static async getFrequencyById(id: string): Promise<IFrequency | null> {
    try {
      return await Frequency.findById(id);
    } catch (error) {
      throw new ApiError(500, "Failed to fetch frequency");
    }
  }

  static async updateFrequency(id: string, data: Partial<IFrequency>): Promise<IFrequency | null> {
    try {
      if (data.name ) {
        const existingFrequency = await Frequency.findOne({ 
          $or: [
            { name: data.name, _id: { $ne: id } }
          ]
        });
        if (existingFrequency) {
          throw new ApiError(400, "Frequency with this name or code already exists");
        }
      }
      
      return await Frequency.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to update frequency");
    }
  }

  static async deleteFrequency(id: string): Promise<boolean> {
    try {
      const result = await Frequency.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new ApiError(500, "Failed to delete frequency");
    }
  }

  static async searchFrequencies(query: string): Promise<IFrequency[]> {
    try {
      return await Frequency.find({
        name: { $regex: query, $options: 'i' }
      }).sort({ name: 1 });
    } catch (error) {
      throw new ApiError(500, "Failed to search frequencies");
    }
  }
} 