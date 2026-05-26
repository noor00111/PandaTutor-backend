import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoryController {
  static async getCategories(req: Request, res: Response) {
    const categories = await prisma.category.findMany();
    res.status(200).json({ status: 'success', data: { categories } });
  }
}
