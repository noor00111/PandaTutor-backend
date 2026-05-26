import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export class TutorService {
  static async getTutors(query: any) {
    const { category, minPrice, maxPrice, minRating } = query;
    
    let whereClause: any = {
      user: {
        isBanned: false,
      }
    };

    if (category) {
      whereClause.subjects = {
        some: {
          name: {
            equals: category,
            mode: 'insensitive'
          }
        }
      };
    }

    if (minPrice || maxPrice) {
      whereClause.hourlyRate = {};
      if (minPrice) whereClause.hourlyRate.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.hourlyRate.lte = parseFloat(maxPrice);
    }

    if (minRating) {
      whereClause.rating = {
        gte: parseFloat(minRating)
      };
    }

    const tutors = await prisma.tutorProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: { name: true, email: true }
        },
        subjects: true,
      }
    });

    return tutors;
  }

  static async getTutorById(id: string) {
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, isBanned: true }
        },
        subjects: true,
        availabilities: true,
      }
    });

    if (!tutor || tutor.user.isBanned) {
      throw new NotFoundError('Tutor not found');
    }

    // -------latest reviews----------- //
    
    const reviews = await prisma.review.findMany({
      where: { tutorId: tutor.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        student: { select: { name: true } }
      }
    });

    return { ...tutor, reviews };
  }

  // -------------Updated by the tutor ----------- //

  static async updateProfile(userId: string, data: any) {
    const { bio, hourlyRate, subjectIds } = data;

    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId }
    });

    if (!tutorProfile) {
      throw new NotFoundError('Tutor profile not found');
    }

    let updateData: any = {};
    if (bio !== undefined) updateData.bio = bio;
    if (hourlyRate !== undefined) updateData.hourlyRate = parseFloat(hourlyRate);
    
    if (subjectIds && Array.isArray(subjectIds)) {
      updateData.subjects = {
        set: subjectIds.map(id => ({ id }))
      };
    }

    const updated = await prisma.tutorProfile.update({
      where: { userId },
      data: updateData,
      include: { subjects: true }
    });

    return updated;
  }

  static async updateAvailability(userId: string, availabilities: any[]) {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!tutorProfile) {
      throw new NotFoundError('Tutor profile not found');
    }

  
    // ----------- wrap in transaction---------- //
    await prisma.$transaction([
      prisma.availability.deleteMany({
        where: { tutorProfileId: tutorProfile.id }
      }),
      prisma.availability.createMany({
        data: availabilities.map(a => ({
          tutorProfileId: tutorProfile.id,
          dayOfWeek: a.dayOfWeek,
          startTime: a.startTime,
          endTime: a.endTime
        }))
      })
    ]);

    const newAvailabilities = await prisma.availability.findMany({
      where: { tutorProfileId: tutorProfile.id }
    });

    return newAvailabilities;
  }
}
