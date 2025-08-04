import { Request, Response } from 'express';
import { FrequencyService } from '../services/frequency.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export class FrequencyController {
  static createFrequency = asyncHandler(async (req: Request, res: Response) => {
    const frequency = await FrequencyService.createFrequency(req.body);
    return res.status(201).json(
      new ApiResponse(201, frequency, "Frequency created successfully")
    );
  });

  static getAllFrequencies = asyncHandler(async (req: Request, res: Response) => {
    const frequencies = await FrequencyService.getAllFrequencies();
    return res.status(200).json(
      new ApiResponse(200, frequencies, "Frequencies fetched successfully")
    );
  });

  static getFrequencyById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const frequency = await FrequencyService.getFrequencyById(id);
    
    if (!frequency) {
      return res.status(404).json(
        new ApiResponse(404, null, "Frequency not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, frequency, "Frequency fetched successfully")
    );
  });

  static updateFrequency = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const frequency = await FrequencyService.updateFrequency(id, req.body);
    
    if (!frequency) {
      return res.status(404).json(
        new ApiResponse(404, null, "Frequency not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, frequency, "Frequency updated successfully")
    );
  });

  static deleteFrequency = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await FrequencyService.deleteFrequency(id);
    
    if (!deleted) {
      return res.status(404).json(
        new ApiResponse(404, null, "Frequency not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, null, "Frequency deleted successfully")
    );
  });

  static searchFrequencies = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json(
        new ApiResponse(400, null, "Search query is required")
      );
    }

    const frequencies = await FrequencyService.searchFrequencies(q);
    return res.status(200).json(
      new ApiResponse(200, frequencies, "Frequencies search completed successfully")
    );
  });
} 