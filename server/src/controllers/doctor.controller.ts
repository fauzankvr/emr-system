import { Request, Response } from 'express';
import { DoctorService } from '../services/doctor.service';
import { HttpStatusCode } from '../constants/statusCodes';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class DoctorController {

    static async register(req: Request, res: Response) {
        try {
            const doctorData = {
                ...req.body,
                availableSlots: JSON.parse(req.body.availableSlots),
                profileImage: req.file ? `/uploads/profileImages/${req.file.filename}` : ''
            };
            const result = await DoctorService.registerDoctor(doctorData);
            res.status(HttpStatusCode.CREATED).json(result);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error: error.message });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await DoctorService.loginDoctor(email, password);
            res.status(HttpStatusCode.OK).json(result);
        } catch (error: any) {
            res.status(HttpStatusCode.UNAUTHORIZED).json({ message: error.message });
        }
    }

    static async logout(req: AuthenticatedRequest, res: Response) {
        try {
            const { refreshToken } = req.body;
            const userId = req.userId;

            if (!refreshToken) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({
                    message: 'Refresh token is required'
                });
            }

            const result = await DoctorService.logout(userId!, refreshToken);
            res.status(HttpStatusCode.OK).json(result);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error: error.message });
        }
    }

    static async getDashboard(req: AuthenticatedRequest, res: Response) {
        try {
            const doctorId = req.userId;
            console.log("Doctor ID:", doctorId);
            res.status(HttpStatusCode.OK).json({ message: "Dashboard loaded successfully" });
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to load dashboard", error: error.message });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
          const doctors = await DoctorService.getAllDoctors();
          res.status(HttpStatusCode.OK).json({
            message: "Doctors fetched successfully",
            data: doctors
          });
        } catch (error: any) {
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
      }
       static async getById(req: Request, res: Response) {
        try {
        const { id } = req.params;
          const doctors = await DoctorService.getDoctorById(id);
          res.status(HttpStatusCode.OK).json({
            message: "Doctors fetched successfully",
            data: doctors
          });
        } catch (error: any) {
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
      }
    static async update(req: Request, res: Response) {
        try {
            const doctor = await DoctorService.updateDoctor(req.params.id, req.body);
            if (!doctor) return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Doctor not found' });
            res.json(doctor);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    static async remove(req: Request, res: Response) {
        try {
            const doctor = await DoctorService.deleteDoctor(req.params.id);
            if (!doctor) return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Doctor not found' });
            res.json({ message: 'Doctor deleted successfully' });
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
}
