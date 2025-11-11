import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { HttpStatusCode } from '../constants/statusCodes';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class BookingController {
  static async create(req: Request, res: Response) {
    try {
      const booking = await BookingService.createBooking(req.body);
      res.status(HttpStatusCode.CREATED).json({ success: true, message: 'Booking created', data: booking });
    } catch (err: any) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: err.message });
    }
  }

  static async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.userId || '';
      const bookings = await BookingService.getAllBookingsByDoctorId(userId);
      const todaysCompletedCount = await BookingService.getTodaysCompletedCountByDoctorId(userId);
      const todaysBookingsCount = await BookingService.getTodaysBookingsCountByDoctorId(userId);

      res.json({ success: true, data: bookings, todaysCompletedCount, todaysBookingsCount });
    } catch (err: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const booking = await BookingService.getBookingById(req.params.id);
      res.json({ success: true, data: booking });
    } catch (err: any) {
      res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: err.message });
    }
  }

  static async getAvailableSlots(req: Request, res: Response) {
    try {
        const {doctorId, date} = req.query;
        // res.json({data: doctorId});
      const slots = await BookingService.getAvailableSlots(doctorId as string, date as string);
      res.json({ success: true, data: slots });
    } catch (err: any) {
        console.log("err : ", err)
      res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updated = await BookingService.updateBooking(req.params.id, req.body);
      res.json({ success: true, message: 'Booking updated', data: updated });
    } catch (err: any) {
      res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: err.message });
    }
  }

  static async cancel(req: Request, res: Response) {
    try {
      const updated = await BookingService.cancelBooking(req.params.id, req.body.reason);
      res.json({ success: true, message: 'Booking cancelled', data: updated });
    } catch (err: any) {
      res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: err.message });
    }
  }

  static async complete(req: Request, res: Response) {
    try {
      const updated = await BookingService.completeBooking(req.params.id, req.body?.notes);
      res.json({ success: true, message: 'Booking marked as completed', data: updated });
    } catch (err: any) {
      res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: err.message });
    }
  }

  static async getByPatient(req: Request, res: Response) {
    try {
      const bookings = await BookingService.getBookingsByPatient(req.params.patientId);
      res.json({ success: true, data: bookings });
    } catch (err: any) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: err.message });
    }
  }

  static async getByDoctor(req: Request, res: Response) {
    try {
      const bookings = await BookingService.getBookingsByDoctor(req.params.doctorId);
      res.json({ success: true, data: bookings });
    } catch (err: any) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await BookingService.deleteBooking(req.params.id);
      res.json({ success: true, message: 'Booking deleted' });
    } catch (err: any) {
      res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: err.message });
    }
  }
}
