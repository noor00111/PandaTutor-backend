import { PrismaClient, BookingStatus, Role } from "@prisma/client";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../utils/errors";

const prisma = new PrismaClient();

export class BookingService {
  static async createBooking(studentId: string, data: any) {
    const { tutorId, date } = data;

    if (!tutorId || !date) {
      throw new BadRequestError("tutorId and date are required");
    }

    const tutor = await prisma.user.findUnique({
      where: { id: tutorId },
      include: { tutorProfile: true },
    });

    if (!tutor || tutor.role !== Role.TUTOR) {
      throw new NotFoundError("Tutor not found");
    }

    const bookingDate = new Date(date);

    // --------Check tutor availability slot----------- //
    const dayOfWeek = bookingDate.getUTCDay();
    const bookingTime = `${String(bookingDate.getUTCHours()).padStart(2, "0")}:${String(bookingDate.getUTCMinutes()).padStart(2, "0")}`;

    const availability = await prisma.availability.findFirst({
      where: {
        tutorProfile: { userId: tutorId },
        dayOfWeek,
      },
    });

    if (!availability) {
      throw new BadRequestError("Tutor is not available on this day");
    }

      if (
        bookingTime < availability.startTime ||
        bookingTime >= availability.endTime
      ) {
        throw new BadRequestError(
          `Tutor is not available at this time. Available on this day: ${availability.startTime} – ${availability.endTime}`,
        );
      }
    
    // ----------Check double booking for student at same time------- //
    const studentConflict = await prisma.booking.findFirst({
      where: {
        studentId,
        date: bookingDate,
        status: BookingStatus.CONFIRMED,
      },
    });

    if (studentConflict) {
      throw new BadRequestError("You already have a booking at this time");
    }

    // ---------------Check tutor is not double-booked--------------- //
    const existing = await prisma.booking.findFirst({
      where: {
        tutorId,
        date: bookingDate,
        status: BookingStatus.CONFIRMED,
      },
    });

    if (existing) {
      throw new BadRequestError("Time slot is already booked for this tutor");
    }

    const booking = await prisma.booking.create({
      data: {
        studentId,
        tutorId,
        date: bookingDate,
        status: BookingStatus.CONFIRMED,
      },
    });

    return booking;
  }

  static async getBookings(userId: string, role: string) {
    let whereClause = {};
    if (role === Role.STUDENT) {
      whereClause = { studentId: userId };
    } else if (role === Role.TUTOR) {
      whereClause = { tutorId: userId };
    } else {
      // Admin gets all, or specific logic
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        student: { select: { id: true, name: true, email: true } },
        tutor: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: "asc" },
    });

    return bookings;
  }

  static async getBookingById(userId: string, role: string, bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        student: { select: { id: true, name: true, email: true } },
        tutor: { select: { id: true, name: true, email: true } },
      },
    });

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (
      role !== Role.ADMIN &&
      booking.studentId !== userId &&
      booking.tutorId !== userId
    ) {
      throw new ForbiddenError(
        "You do not have permission to view this booking",
      );
    }

    return booking;
  }

  static async updateBookingStatus(
    userId: string,
    role: string,
    bookingId: string,
    status: BookingStatus,
  ) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    // ------------role checks-------------
    if (role === Role.STUDENT) {
      if (booking.studentId !== userId)
        throw new ForbiddenError("Not your booking");
      if (status !== BookingStatus.CANCELLED)
        throw new BadRequestError("Students can only cancel bookings");
    } else if (role === Role.TUTOR) {
      if (booking.tutorId !== userId)
        throw new ForbiddenError("Not your booking");
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    return updatedBooking;
  }
  static async hasAvailability(tutorId: string): Promise<boolean> {
    const count = await prisma.availability.count({
      where: {
        tutorProfile: { userId: tutorId },
      },
    });
    return count > 0;
  }
}
