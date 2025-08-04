import { IDays, Days } from "../models/days.model";
import { ApiError } from "../utils/ApiError";

export class DaysService {
  static async createDays(data: Partial<IDays>): Promise<IDays> {
    try {
      const existingDays = await Days.findOne({ name: data.name });
      if (existingDays) {
        throw new ApiError(400, "Days with this name already exists");
      }
      
      return await Days.create(data);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to create days");
    }
  }

  static async getAllDays(): Promise<IDays[]> {
    try {
      return await Days.find().sort({ name: 1 });
    } catch (error) {
      throw new ApiError(500, "Failed to fetch days");
    }
  }

  static async getDaysById(id: string): Promise<IDays | null> {
    try {
      return await Days.findById(id);
    } catch (error) {
      throw new ApiError(500, "Failed to fetch days");
    }
  }

  static async updateDays(id: string, data: Partial<IDays>): Promise<IDays | null> {
    try {
      if (data.name) {
        const existingDays = await Days.findOne({ 
          name: data.name, 
          _id: { $ne: id } 
        });
        if (existingDays) {
          throw new ApiError(400, "Days with this name already exists");
        }
      }
      
      return await Days.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to update days");
    }
  }

  static async deleteDays(id: string): Promise<boolean> {
    try {
      const result = await Days.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new ApiError(500, "Failed to delete days");
    }
  }

  static async searchDays(query: string): Promise<IDays[]> {
    try {
      return await Days.find({
        name: { $regex: query, $options: 'i' }
      }).sort({ name: 1 });
    } catch (error) {
      throw new ApiError(500, "Failed to search days");
    }
  }

  static async getDaysByUnit(unit: string): Promise<IDays[]> {
    try {
      return await Days.find({ 
        unit: unit 
      }).sort({ name: 1 });
    } catch (error) {
      throw new ApiError(500, "Failed to fetch days by unit");
    }
  }
} 