import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  static async register(req: Request, res: Response) {
    const result = await AuthService.register(req.body);
    res.status(201).json({
      status: 'success',
      data: result,
    });
  }

  static async login(req: Request, res: Response) {
    const result = await AuthService.login(req.body);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  }

  static async getMe(req: Request, res: Response) {
    const userId = req.user!.userId;
    const user = await AuthService.getMe(userId);
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  }

  static async deleteMe(req: Request, res: Response) {
    const userId = req.user!.userId;
    const result = await AuthService.deleteMe(userId);
    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  }
}
