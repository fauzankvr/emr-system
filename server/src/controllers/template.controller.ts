import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { TemplateService } from '../services/template.service';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { Types } from 'mongoose';

// Create a new template
export const createTemplate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, description, medicines, diagnosis, notes, labReports, labTest } = req.body;
  const doctorId = req.userId;

  if (!doctorId) {
    throw new ApiError(401, "User not authenticated");
  }

  if (!name) {
    throw new ApiError(400, "Template name is required");
  }

  const templateData = {
    doctor: new Types.ObjectId(doctorId),
    name,
    description,
    medicines,
    diagnosis,
    notes,
    labReports,
    labTest,
  };

  const createdTemplate = await TemplateService.createTemplate(templateData);

  res.status(201).json(
    new ApiResponse(201, createdTemplate, "Template created successfully")
  );
});

// Get all templates for a doctor
export const getTemplates = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const doctorId = req.userId;

  if (!doctorId) {
    throw new ApiError(401, "User not authenticated");
  }

  const templates = await TemplateService.getTemplatesByDoctor(doctorId);

  res.status(200).json(
    new ApiResponse(200, templates, "Templates fetched successfully")
  );
});

// Get a single template by ID
export const getTemplateById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const doctorId = req.userId;

  if (!doctorId) {
    throw new ApiError(401, "User not authenticated");
  }

  const template = await TemplateService.getTemplateByIdAndDoctor(id, doctorId);

  if (!template) {
    throw new ApiError(404, "Template not found");
  }

  res.status(200).json(
    new ApiResponse(200, template, "Template fetched successfully")
  );
});

// Update a template
export const updateTemplate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const doctorId = req.userId;
  const updateData = req.body;

  if (!doctorId) {
    throw new ApiError(401, "User not authenticated");
  }

  const template = await TemplateService.getTemplateByIdAndDoctor(id, doctorId);

  if (!template) {
    throw new ApiError(404, "Template not found");
  }

  const updatedTemplate = await TemplateService.updateTemplate(id, updateData);

  res.status(200).json(
    new ApiResponse(200, updatedTemplate, "Template updated successfully")
  );
});

// Delete a template
export const deleteTemplate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const doctorId = req.userId;

  if (!doctorId) {
    throw new ApiError(401, "User not authenticated");
  }

  const template = await TemplateService.getTemplateByIdAndDoctor(id, doctorId);

  if (!template) {
    throw new ApiError(404, "Template not found");
  }

  await TemplateService.deleteTemplate(id);

  res.status(200).json(
    new ApiResponse(200, {}, "Template deleted successfully")
  );
});

// Apply template to create prescription
export const applyTemplate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { templateId, patientId } = req.body;
  const doctorId = req.userId;

  if (!doctorId) {
    throw new ApiError(401, "User not authenticated");
  }

  if (!templateId || !patientId) {
    throw new ApiError(400, "Template ID and Patient ID are required");
  }

  const template = await TemplateService.getTemplateByIdAndDoctor(templateId, doctorId);

  if (!template) {
    throw new ApiError(404, "Template not found");
  }

  // Create prescription data from template
  const prescriptionData = {
    doctor: doctorId,
    patient: patientId,
    medicines: template.medicines,
    diagnosis: template.diagnosis,
    notes: template.notes,
    labReports: template.labReports,
    labTest: template.labTest,
  };

  res.status(200).json(
    new ApiResponse(200, prescriptionData, "Template applied successfully")
  );
}); 