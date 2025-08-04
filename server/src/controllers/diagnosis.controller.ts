import { Request, Response } from 'express';
import { DiagnosisService } from '../services/diagnosis.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export class DiagnosisController {
  static createDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    const diagnosis = await DiagnosisService.createDiagnosis(req.body);
    return res.status(201).json(
      new ApiResponse(201, diagnosis, "Diagnosis created successfully")
    );
  });

  static getAllDiagnoses = asyncHandler(async (req: Request, res: Response) => {
    const diagnoses = await DiagnosisService.getAllDiagnoses();
    return res.status(200).json(
      new ApiResponse(200, diagnoses, "Diagnoses fetched successfully")
    );
  });

  static getDiagnosisById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const diagnosis = await DiagnosisService.getDiagnosisById(id);
    
    if (!diagnosis) {
      return res.status(404).json(
        new ApiResponse(404, null, "Diagnosis not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, diagnosis, "Diagnosis fetched successfully")
    );
  });

  static updateDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const diagnosis = await DiagnosisService.updateDiagnosis(id, req.body);
    
    if (!diagnosis) {
      return res.status(404).json(
        new ApiResponse(404, null, "Diagnosis not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, diagnosis, "Diagnosis updated successfully")
    );
  });

  static deleteDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await DiagnosisService.deleteDiagnosis(id);
    
    if (!deleted) {
      return res.status(404).json(
        new ApiResponse(404, null, "Diagnosis not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, null, "Diagnosis deleted successfully")
    );
  });

  static searchDiagnoses = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json(
        new ApiResponse(400, null, "Search query is required")
      );
    }

    const diagnoses = await DiagnosisService.searchDiagnoses(q);
    return res.status(200).json(
      new ApiResponse(200, diagnoses, "Diagnoses search completed successfully")
    );
  });
} 