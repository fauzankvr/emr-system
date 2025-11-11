import { Request, Response } from 'express';
import { LabService } from '../services/lab.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export class LabController {
  static createLab = asyncHandler(async (req: Request, res: Response) => {
    const lab = await LabService.createLab(req.body);
    return res.status(201).json(
      new ApiResponse(201, lab, "Lab created successfully")
    );
  });

  static getAllLabs = asyncHandler(async (req: Request, res: Response) => {
    const labs = await LabService.getAllLabs();
    return res.status(200).json(
      new ApiResponse(200, labs, "Labs fetched successfully")
    );
  });

  static loginLab = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const lab = await LabService.loginLab(email, password);
    if (!lab) {
      return res.status(401).json(
        new ApiResponse(401, null, "Invalid email or password")
      );
    }
    return res.status(200).json(
      new ApiResponse(200, lab, "Lab logged in successfully")
    );
  });

  static getLabById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const lab = await LabService.getLabById(id);
    
    if (!lab) {
      return res.status(404).json(
        new ApiResponse(404, null, "Lab not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, lab, "Lab fetched successfully")
    );
  });

  static updateLab = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const lab = await LabService.updateLab(id, req.body);
    
    if (!lab) {
      return res.status(404).json(
        new ApiResponse(404, null, "Lab not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, lab, "Lab updated successfully")
    );
  });
  static updateLabStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, prescriptionId } = req.body;
    const lab = await LabService.updateStatus(id, status, prescriptionId);

    if (!lab) {
      return res.status(404).json(
        new ApiResponse(404, null, "Lab not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, lab, "Lab status updated successfully")
    );
  });

  static deleteLab = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await LabService.deleteLab(id);
    
    if (!deleted) {
      return res.status(404).json(
        new ApiResponse(404, null, "Lab not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, null, "Lab deleted successfully")
    );
  });

  static searchLabs = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json(
        new ApiResponse(400, null, "Search query is required")
      );
    }

    const labs = await LabService.searchLabs(q);
    return res.status(200).json(
      new ApiResponse(200, labs, "Labs search completed successfully")
    );
  });

  // controllers/lab.controller.ts
static updateLabReportImage = asyncHandler(async (req: Request, res: Response) => {
  const { labReportId } = req.params;               // _id of the element in labReports[]
  const { prescriptionId, reportImageUrl, reportDate } = req.body;

  if (!prescriptionId || !reportImageUrl) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "prescriptionId and reportImageUrl are required"));
  }

  const updated = await LabService.updateReportImage(
    prescriptionId,
    labReportId,
    reportImageUrl,
    reportDate   // optional – will be saved only if sent
  );

  if (!updated) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Prescription or lab-report not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Report image saved successfully"));
});
}
