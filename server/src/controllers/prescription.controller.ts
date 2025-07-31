import { Request, Response } from "express";
import { PrescriptionService } from "../services/prescription.service";
import { HttpStatusCode } from "../constants/statusCodes";
import { asyncHandler } from "../utils/asyncHandler";

export class PrescriptionController {
  static async create(req: Request, res: Response) {
    if (req.file && req.body.labReports) {
      try {
        const labReports = JSON.parse(req.body.labReports);
        if (labReports.length > 0) {
          labReports[0].reportImageUrl = `/labReports/${req.file.filename}`;
        }
        req.body.labReports = labReports;
      } catch (e) {
        req.body.labReports[0].reportImageUrl = `/labReports/${req.file.filename}`;
      }
    }
    try {
      const { body } = req;
      const prescription = await PrescriptionService.createPrescription(body);
      return res
        .status(HttpStatusCode.CREATED)
        .json({ success: true, data: prescription });
    } catch (error: any) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
  static async getAll(req: Request, res: Response) {
    try {
      const prescription = await PrescriptionService.getAllPrescriptions();
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, data: prescription });
    } catch (error: any) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const prescription = await PrescriptionService.getPrescriptionById(
        req.params.id
      );
      if (!prescription) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ success: false, message: "Prescription not found" });
      }
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, data: prescription });
    } catch (error: any) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  static async getByPatient(req: Request, res: Response) {
    try {
      const prescriptions = await PrescriptionService.getPrescriptionsByPatient(
        req.params.patientId
      );
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, data: prescriptions });
    } catch (error: any) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  static async getByDoctor(req: Request, res: Response) {
    try {
      const prescriptions = await PrescriptionService.getPrescriptionsByDoctor(
        req.params.doctorId
      );
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, data: prescriptions });
    } catch (error: any) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    if (req.file && req.body.labReports) {
      try {
        const labReports = JSON.parse(req.body.labReports);
        if (labReports.length > 0) {
          labReports[0].reportImageUrl = `/labReports/${req.file.filename}`;
        }
        req.body.labReports = labReports;
      } catch (e) {
        req.body.labReports[0].reportImageUrl = `/labReports/${req.file.filename}`;
      }
    }
    try {
      const updated = await PrescriptionService.updatePrescription(
        req.params.id,
        req.body
      );
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, data: updated });
    } catch (error: any) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await PrescriptionService.deletePrescription(req.params.id);
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, message: "Prescription deleted successfully" });
    } catch (error: any) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  static async uploadLabReport(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ success: false, message: "No file uploaded" });
      }

      const reportImageUrl = `https://res.cloudinary.com/dnxz7tkcb/${req.file.filename}`;
      
      return res
        .status(HttpStatusCode.OK)
        .json({ 
          success: true, 
          data: { 
            reportImageUrl,
            filename: req.file.filename 
          } 
        });
    } catch (error: any) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
}
