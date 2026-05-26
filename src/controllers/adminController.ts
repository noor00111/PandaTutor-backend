import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';

export class AdminController {
  static async getUsers(req: Request, res: Response) {
    const users = await AdminService.getUsers();
    res.status(200).json({ status: 'success', data: { users } });
  }

  static async updateUserStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { isBanned } = req.body;
    const user = await AdminService.updateUserStatus(id, !!isBanned);
    res.status(200).json({ status: 'success', data: { user } });
  }

  static async getBookings(req: Request, res: Response) {
    const bookings = await AdminService.getBookings();
    res.status(200).json({ status: 'success', data: { bookings } });
  }

  static async getCategories(req: Request, res: Response) {
    const categories = await AdminService.getCategories();
    res.status(200).json({ status: 'success', data: { categories } });
  }

  static async createCategory(req: Request, res: Response) {
    const { name } = req.body;
    const category = await AdminService.createCategory(name);
    res.status(201).json({ status: 'success', data: { category } });
  }

  static async updateCategory(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;
    const category = await AdminService.updateCategory(id, name);
    res.status(200).json({ status: 'success', data: { category } });
  }

  static async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;
    await AdminService.deleteCategory(id);
    res.status(204).send();
  }
}
