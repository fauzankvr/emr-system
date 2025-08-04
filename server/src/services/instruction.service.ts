import { IInstruction, Instruction } from "../models/instruction.model";
import { ApiError } from "../utils/ApiError";

export class InstructionService {
  static async createInstruction(data: Partial<IInstruction>): Promise<IInstruction> {
    try {
      const existingInstruction = await Instruction.findOne({ name: data.name });
      if (existingInstruction) {
        throw new ApiError(400, "Instruction with this name already exists");
      }
      
      return await Instruction.create(data);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to create instruction");
    }
  }

  static async getAllInstructions(): Promise<IInstruction[]> {
    try {
      return await Instruction.find().sort({ name: 1 });
    } catch (error) {
      throw new ApiError(500, "Failed to fetch instructions");
    }
  }

  static async getInstructionById(id: string): Promise<IInstruction | null> {
    try {
      return await Instruction.findById(id);
    } catch (error) {
      throw new ApiError(500, "Failed to fetch instruction");
    }
  }

  static async updateInstruction(id: string, data: Partial<IInstruction>): Promise<IInstruction | null> {
    try {
      if (data.name) {
        const existingInstruction = await Instruction.findOne({ 
          name: data.name, 
          _id: { $ne: id } 
        });
        if (existingInstruction) {
          throw new ApiError(400, "Instruction with this name already exists");
        }
      }
      
      return await Instruction.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to update instruction");
    }
  }

  static async deleteInstruction(id: string): Promise<boolean> {
    try {
      const result = await Instruction.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new ApiError(500, "Failed to delete instruction");
    }
  }

  static async searchInstructions(query: string): Promise<IInstruction[]> {
    try {
      return await Instruction.find({
        name: { $regex: query, $options: 'i' }
      }).sort({ name: 1 });
    } catch (error) {
      throw new ApiError(500, "Failed to search instructions");
    }
  }

  static async getInstructionsByCategory(category: string): Promise<IInstruction[]> {
    try {
      return await Instruction.find({ 
        category: { $regex: category, $options: 'i' } 
      }).sort({ name: 1 });
    } catch (error) {
      throw new ApiError(500, "Failed to fetch instructions by category");
    }
  }
} 