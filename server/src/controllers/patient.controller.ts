import { Request, Response } from "express";
import { PatientService } from "../services/patient.service";
import { HttpStatusCode } from "../constants/statusCodes";

export class PatientController {
  static async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const patient = await PatientService.createPatient(data);
      res.status(HttpStatusCode.CREATED).json({
        message: "Patient created successfully",
        data: patient
      });
    } catch (error: any) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const patients = await PatientService.getAllPatients();
      res.status(HttpStatusCode.OK).json({
        message: "Patients fetched successfully",
        data: patients
      });
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const patient = await PatientService.getPatientById(id);
      res.status(HttpStatusCode.OK).json({
        message: "Patient fetched successfully",
        data: patient
      });
    } catch (error: any) {
      res.status(HttpStatusCode.NOT_FOUND).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await PatientService.updatePatient(id, req.body);
      res.status(HttpStatusCode.OK).json({
        message: "Patient updated successfully",
        data: updated
      });
    } catch (error: any) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
    }
  }

  static async updateVitals (req: Request, res: Response) {
    const { id } = req.params;
    const { vitals } = req.body;
    if (!vitals) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Vitals data required' });
      return;
    }
    const updated = await PatientService.updatePatientVitals(id, vitals);
    if (!updated) {
      res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Patient not found' });
      return;
    }
    res.json({ message: 'Vitals updated', data: updated });
  };

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await PatientService.deletePatient(id);
      res.status(HttpStatusCode.NO_CONTENT).json({ message: "Patient deleted successfully" });
    } catch (error: any) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
    }
  }

  static async search(req: Request, res: Response) {
    try {
      const { q } = req.query;
      const results = await PatientService.searchPatients(q as string);
      res.status(HttpStatusCode.OK).json({
        message: "Search results fetched successfully",
        data: results
      });
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  static async uploadIdCard(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ success: false, message: 'No file uploaded' });
      }

      const patientId = req.params.id;
      const cardUrl = req.file.path;               

      const updated = await PatientService.updatePatient(
        patientId,
        { cardUrl },
      );

      if (!updated) throw new Error('Patient not found');

      return res.status(HttpStatusCode.OK).json({
        success: true,
        data: { cardUrl},
      });
    } catch (error: any) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
}
