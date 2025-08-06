import { Request, Response } from 'express';
import { DosageService } from '../services/dosage.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export class DosageController {
  static createDosage = asyncHandler(async (req: Request, res: Response) => {
    const dosage = await DosageService.createDosage(req.body);
    return res.status(201).json(
      new ApiResponse(201, dosage, "Dosage created successfully")
    );
  });

  static getAllDosages = asyncHandler(async (req: Request, res: Response) => {
    const dosages = await DosageService.getAllDosages();
    return res.status(200).json(
      new ApiResponse(200, dosages, "Dosages fetched successfully")
    );
  });

  static getDosageById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const dosage = await DosageService.getDosageById(id);
    
    if (!dosage) {
      return res.status(404).json(
        new ApiResponse(404, null, "Dosage not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, dosage, "Dosage fetched successfully")
    );
  });

  static updateDosage = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const dosage = await DosageService.updateDosage(id, req.body);
    
    if (!dosage) {
      return res.status(404).json(
        new ApiResponse(404, null, "Dosage not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, dosage, "Dosage updated successfully")
    );
  });

  static deleteDosage = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await DosageService.deleteDosage(id);
    
    if (!deleted) {
      return res.status(404).json(
        new ApiResponse(404, null, "Dosage not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, null, "Dosage deleted successfully")
    );
  });

  static searchDosages = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json(
        new ApiResponse(400, null, "Search query is required")
      );
    }

    const dosages = await DosageService.searchDosages(q);
    return res.status(200).json(
      new ApiResponse(200, dosages, "Dosages search completed successfully")
    );
  });
} 