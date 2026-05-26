import { PrismaClient, BookingStatus } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export class ReviewService {
  static async createReview(studentId: string, data: any) {
    const { tutorId, rating, comment } = data;

    if (!tutorId || rating === undefined) {
      throw new BadRequestError('tutorId and rating are required');
    }

    if (rating < 1 || rating > 5) {
      throw new BadRequestError('Rating must be between 1 and 5');
    }

    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: tutorId }
    });

    if (!tutorProfile) {
      throw new NotFoundError('Tutor not found');
    }

    // ------ensure student has a COMPLETED booking with this tutor----------//
    const completedBooking = await prisma.booking.findFirst({
      where: {
        studentId,
        tutorId,
        status: BookingStatus.COMPLETED
      }
    });

    if (!completedBooking) {
      throw new BadRequestError('You can only review tutors you have completed a session with');
    }

    // ----------Create review--------- //
    const review = await prisma.review.create({
      data: {
        studentId,
        tutorId,
        rating,
        comment
      }
    });

    // ----------Update tutor's average rating ---------- //
    const aggregated = await prisma.review.aggregate({
      where: { tutorId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    await prisma.tutorProfile.update({
      where: { userId: tutorId },
      data: {
        rating: aggregated._avg.rating || 0,
        totalReviews: aggregated._count.rating
      }
    });

    return review;
  }
}
