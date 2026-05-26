import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { BadRequestError, UnauthorizedError } from '../utils/errors';

const prisma = new PrismaClient();

export class AuthService {
  static async register(data: any) {
    const { name, email, password, role } = data;

    if (!name || !email || !password || !role) {
      throw new BadRequestError('Missing required fields');
    }

    if (![Role.STUDENT, Role.TUTOR].includes(role)) {
      throw new BadRequestError('Invalid role specified');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as Role,

        //------------ create a basic tutor profile if role is TUTOR ------------//
        ...(role === Role.TUTOR ? {
          tutorProfile: {
            create: {}
          }
        } : {})
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    const token = generateToken({ userId: user.id, role: user.role });

    return { user, token };
  }

  static async login(data: any) {
    const { email, password } = data;

    if (!email || !password) {
      throw new BadRequestError('Missing email or password');
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (user.isBanned) {
      throw new UnauthorizedError('Your account has been banned');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken({ userId: user.id, role: user.role });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBanned: true,
        tutorProfile: {
          include: { subjects: true }
        },
      }
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user;
  }

  static async deleteMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { tutorProfile: true }
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    //------------ Execute in transaction to ensure complete cleanup -----------------//
    await prisma.$transaction(async (tx) => {

      //--------- 1. Delete associated student & tutor bookings -------------//
      await tx.booking.deleteMany({
        where: { OR: [{ studentId: userId }, { tutorId: userId }] }
      });

      //---------- 2. Delete associated student & tutor reviews -------------//
      await tx.review.deleteMany({
        where: { OR: [{ studentId: userId }, { tutorId: userId }] }
      });

      //----------- 3. Delete tutor profile if it exists (Automatically cascades availabilities) ---------------//
      if (user.tutorProfile) {
        await tx.tutorProfile.delete({
          where: { userId: userId }
        });
      }

      //------------ 4. Finally delete user ---------//
      await tx.user.delete({
        where: { id: userId }
      });
    });

    return { message: 'Account deleted successfully' };
  }
}
