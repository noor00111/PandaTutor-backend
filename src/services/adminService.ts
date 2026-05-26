import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export class AdminService {
  static async getUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBanned: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateUserStatus(userId: string, isBanned: boolean) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return await prisma.user.update({
      where: { id: userId },
      data: { isBanned },
      select: { id: true, name: true, email: true, isBanned: true }
    });
  }

  static async getBookings() {
    return await prisma.booking.findMany({
      include: {
        student: { select: { id: true, name: true, email: true } },
        tutor: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getCategories() {
    return await prisma.category.findMany();
  }

  static async createCategory(name: string) {
    return await prisma.category.create({
      data: { name }
    });
  }

  static async updateCategory(id: string, name: string) {
    return await prisma.category.update({
      where: { id },
      data: { name }
    });
  }

  static async deleteCategory(id: string) {
    return await prisma.category.delete({
      where: { id }
    });
  }
}
