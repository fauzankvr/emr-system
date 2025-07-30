import { Template, ITemplate } from '../models/template.model';
import { ApiError } from '../utils/ApiError';

export class TemplateService {
  // Create a new template
  static async createTemplate(templateData: Partial<ITemplate>): Promise<ITemplate> {
    const template = await Template.create(templateData);
    return template;
  }

  // Get all templates for a doctor
  static async getTemplatesByDoctor(doctorId: string): Promise<ITemplate[]> {
    const templates = await Template.find({ doctor: doctorId }).sort({ updatedAt: -1 });
    return templates;
  }

  // Get a single template by ID and doctor
  static async getTemplateByIdAndDoctor(templateId: string, doctorId: string): Promise<ITemplate | null> {
    const template = await Template.findOne({ _id: templateId, doctor: doctorId });
    return template;
  }

  // Update a template
  static async updateTemplate(templateId: string, updateData: Partial<ITemplate>): Promise<ITemplate | null> {
    const updatedTemplate = await Template.findByIdAndUpdate(
      templateId,
      updateData,
      { new: true }
    );
    return updatedTemplate;
  }

  // Delete a template
  static async deleteTemplate(templateId: string): Promise<boolean> {
    const result = await Template.findByIdAndDelete(templateId);
    return !!result;
  }

  // Check if template exists and belongs to doctor
  static async validateTemplateOwnership(templateId: string, doctorId: string): Promise<boolean> {
    const template = await Template.findOne({ _id: templateId, doctor: doctorId });
    return !!template;
  }
} 