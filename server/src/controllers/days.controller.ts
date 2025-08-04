import { Request, Response } from 'express';
import { DaysService } from '../services/days.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export class DaysController {
  static createDays = asyncHandler(async (req: Request, res: Response) => {
    const days = await DaysService.createDays(req.body);
    return res.status(201).json(
      new ApiResponse(201, days, "Days created successfully")
    );
  });

  static getAllDays = asyncHandler(async (req: Request, res: Response) => {
    const days = await DaysService.getAllDays();
    return res.status(200).json(
      new ApiResponse(200, days, "Days fetched successfully")
    );
  });

  static getDaysById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const days = await DaysService.getDaysById(id);
    
    if (!days) {
      return res.status(404).json(
        new ApiResponse(404, null, "Days not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, days, "Days fetched successfully")
    );
  });

  static updateDays = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const days = await DaysService.updateDays(id, req.body);
    
    if (!days) {
      return res.status(404).json(
        new ApiResponse(404, null, "Days not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, days, "Days updated successfully")
    );
  });

  static deleteDays = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await DaysService.deleteDays(id);
    
    if (!deleted) {
      return res.status(404).json(
        new ApiResponse(404, null, "Days not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, null, "Days deleted successfully")
    );
  });

  static searchDays = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json(
        new ApiResponse(400, null, "Search query is required")
      );
    }

    const days = await DaysService.searchDays(q);
    return res.status(200).json(
      new ApiResponse(200, days, "Days search completed successfully")
    );
  });

  static getDaysByUnit = asyncHandler(async (req: Request, res: Response) => {
    const { unit } = req.params;
    const days = await DaysService.getDaysByUnit(unit);
    return res.status(200).json(
      new ApiResponse(200, days, "Days fetched by unit successfully")
    );
  });
} 