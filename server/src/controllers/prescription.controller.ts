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
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      search = "",
      sort = "updatedAt",
      order = "desc",
      startDate,  // ← NEW
      endDate,    // ← NEW
      isLabTestOnly,
    } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));

    const result = await PrescriptionService.getAllPrescriptions({
      page: pageNum,
      limit: limitNum,
      search: search as string,
      sort: sort as string,
      order: order as "asc" | "desc",
      startDate: startDate as string,  // pass through
      endDate: endDate as string,      // pass through
      isLabTestOnly: isLabTestOnly === "true",  // convert to boolean
    });

    return res.status(HttpStatusCode.OK).json({
      success: true,
      data: result.docs,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
        hasPrev: result.hasPrev,
      },
    });
  });

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

  // New method to save prescription without sending email
  static async savePrescription(req: Request, res: Response) {
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
      const prescription = await PrescriptionService.savePrescription(body);
      return res
        .status(HttpStatusCode.CREATED)
        .json({ success: true, data: prescription });
    } catch (error: any) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  // New method to send prescription email only
  static async sendEmail(req: Request, res: Response) {
    try {
      const { prescriptionId } = req.params;
      const result = await PrescriptionService.sendPrescriptionEmail(prescriptionId);
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, data: result });
    } catch (error: any) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

   static async getProceduresList(req: Request, res: Response) {
  try {
    console.log("Received request to get procedures list with query:", req.query);
    const result = await PrescriptionService.getProceduresList({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 50,
      search: (req.query.search as string) || '',
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      sort: (req.query.sort as any) || 'updatedAt',
      order: (req.query.order as any) || 'desc',
    });

    return res.json(result); // { success, data: [...], meta: {...} }
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch procedures',
    });
  }
}
}