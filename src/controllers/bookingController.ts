import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';

export class BookingController {
  static async createBooking(req: Request, res: Response) {
    const studentId = req.user!.userId;
    const booking = await BookingService.createBooking(studentId, req.body);
    res.status(201).json({
      status: 'success',
      data: { booking }
    });
  }

  static async getBookings(req: Request, res: Response) {
    const userId = req.user!.userId;
    const role = req.user!.role;
    const bookings = await BookingService.getBookings(userId, role);
    
    res.status(200).json({
      status: 'success',
      data: { bookings }
    });
  }

  static async getBookingById(req: Request, res: Response) {
    const userId = req.user!.userId;
    const role = req.user!.role;
    const { id } = req.params;

    const booking = await BookingService.getBookingById(userId, role, id);
    res.status(200).json({
      status: 'success',
      data: { booking }
    });
  }

  static async updateStatus(req: Request, res: Response) {
    const userId = req.user!.userId;
    const role = req.user!.role;
    const { id } = req.params;
    const { status } = req.body;

    const booking = await BookingService.updateBookingStatus(userId, role, id, status);
    res.status(200).json({
      status: 'success',
      data: { booking }
    });
  }
}
