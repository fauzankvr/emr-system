import { Request, Response } from 'express';
import { InstructionService } from '../services/instruction.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export class InstructionController {
  static createInstruction = asyncHandler(async (req: Request, res: Response) => {
    const instruction = await InstructionService.createInstruction(req.body);
    return res.status(201).json(
      new ApiResponse(201, instruction, "Instruction created successfully")
    );
  });

  static getAllInstructions = asyncHandler(async (req: Request, res: Response) => {
    const instructions = await InstructionService.getAllInstructions();
    return res.status(200).json(
      new ApiResponse(200, instructions, "Instructions fetched successfully")
    );
  });

  static getInstructionById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const instruction = await InstructionService.getInstructionById(id);
    
    if (!instruction) {
      return res.status(404).json(
        new ApiResponse(404, null, "Instruction not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, instruction, "Instruction fetched successfully")
    );
  });

  static updateInstruction = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const instruction = await InstructionService.updateInstruction(id, req.body);
    
    if (!instruction) {
      return res.status(404).json(
        new ApiResponse(404, null, "Instruction not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, instruction, "Instruction updated successfully")
    );
  });

  static deleteInstruction = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await InstructionService.deleteInstruction(id);
    
    if (!deleted) {
      return res.status(404).json(
        new ApiResponse(404, null, "Instruction not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, null, "Instruction deleted successfully")
    );
  });

  static searchInstructions = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json(
        new ApiResponse(400, null, "Search query is required")
      );
    }

    const instructions = await InstructionService.searchInstructions(q);
    return res.status(200).json(
      new ApiResponse(200, instructions, "Instructions search completed successfully")
    );
  });

  static getInstructionsByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.params;
    const instructions = await InstructionService.getInstructionsByCategory(category);
    return res.status(200).json(
      new ApiResponse(200, instructions, "Instructions fetched by category successfully")
    );
  });
} 