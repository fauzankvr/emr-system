import { BookingModel, IBooking } from '../models/booking.model';
import { Types } from 'mongoose';
import { DoctorModel } from '../models/doctor.model';

function generateTimeSlots(startTime: string, endTime: string, interval: number = 20): string[] {
    const slots: string[] = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
  
    let start = new Date();
    start.setHours(startHour, startMinute, 0, 0);
  
    const end = new Date();
    end.setHours(endHour, endMinute, 0, 0);
  
    while (start < end) {
      const slot = `${start.getHours().toString().padStart(2, '0')}:${start
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
      slots.push(slot);
      start.setMinutes(start.getMinutes() + interval);
    }
  
    return slots;
  }

export class BookingService {
    static async getAvailableSlots(doctorId: string, date: string): Promise<string[]> {
        console.log(`Fetching available slots for doctorId: ${doctorId} on date: ${date}`);
        
        const doctor = await DoctorModel.findById(doctorId);
        if (!doctor) {
            console.error('Doctor not found');
            throw new Error('Doctor not found');
        }
        console.log(`Doctor found: ${doctor.name}`);
    
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        console.log(`Day of week for date ${date}: ${dayOfWeek}`);
        
        const slotForDay = doctor.availableSlots.find(slot => slot.day === dayOfWeek);
        if (!slotForDay) {
            console.log('No available slots for the given day');
            return [];
        }
        console.log(`Slot for day: ${JSON.stringify(slotForDay)}`);
    
        const allSlots = generateTimeSlots(slotForDay.startTime, slotForDay.endTime);
        console.log(`Generated time slots: ${allSlots}`);
        
        const booked = await BookingModel.find({
          doctorId,
          appointmentDate: new Date(date),
          status: 'booked'
        });
        console.log(`Booked slots: ${JSON.stringify(booked)}`);
    
        const bookedSlots = booked.map(b => b.timeSlot);
        console.log(`Booked time slots: ${bookedSlots}`);
        
        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
        console.log(`Available slots: ${availableSlots}`);
        
        return availableSlots;
    }
    
      static async createBooking(data: Partial<IBooking>): Promise<IBooking> {
        const { patientId, doctorId, appointmentDate, timeSlot } = data;
    
        if (!patientId || !doctorId || !appointmentDate || !timeSlot) {
          throw new Error('Missing required booking fields: patientId, doctorId, appointmentDate, or timeSlot');
        }
    
        const availableSlots = await this.getAvailableSlots(doctorId.toString(), appointmentDate.toString());
        if (!availableSlots.includes(timeSlot)) {
          throw new Error('Selected time slot is not available');
        }
    
        const booking = new BookingModel(data);
        await booking.save();
        return booking.toObject();
    }

  static async getAllBookings(): Promise<IBooking[]> {
    return await BookingModel.find().populate('patientId doctorId');
  }
  static async getAllBookingsByDoctorId(doctorId: string): Promise<IBooking[]> {
    return await BookingModel.find({doctorId}).populate('patientId doctorId');
  }

  static async getBookingById(id: string): Promise<IBooking> {
    const booking = await BookingModel.findById(id).populate('patientId doctorId');
    if (!booking) throw new Error('Booking not found');
    return booking.toObject();
  }

  static async updateBooking(id: string, data: Partial<IBooking>): Promise<IBooking> {
    const updated = await BookingModel.findByIdAndUpdate(id, data, { new: true });
    if (!updated) throw new Error('Booking not found');
    return updated.toObject();
  }

  static async cancelBooking(id: string, reason: string): Promise<IBooking> {
    const booking = await BookingModel.findById(id);
    if (!booking) throw new Error('Booking not found');

    booking.status = 'cancelled';
    booking.reason = reason || 'No reason provided';
    await booking.save();

    return booking.toObject();
  }

  static async completeBooking(id: string, notes: string): Promise<IBooking> {
    let booking = await BookingModel.findById(id);
    if (!booking) {
      booking = await BookingModel.findOne({patientId: id,status: 'booked'});
    }
    if (!booking) throw new Error('Booking not found');
    booking.status = 'completed';
    booking.notes = notes || 'no nots';
    await booking.save();

    return booking.toObject();
  }

  static async getBookingsByPatient(patientId: string): Promise<IBooking[]> {
    if (!Types.ObjectId.isValid(patientId)) throw new Error('Invalid patient ID');
    return await BookingModel.find({ patientId }).populate('doctorId');
  }

  static async getBookingsByDoctor(doctorId: string): Promise<IBooking[]> {
    if (!Types.ObjectId.isValid(doctorId)) throw new Error('Invalid doctor ID');
    return await BookingModel.find({ doctorId }).populate('patientId');
  }

  static async deleteBooking(id: string): Promise<void> {
    const deleted = await BookingModel.findByIdAndDelete(id);
    if (!deleted) throw new Error('Booking not found');
  }
}
