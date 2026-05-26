import { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService';

export class ReviewController {
  static async createReview(req: Request, res: Response) {
    const studentId = req.user!.userId;
    const review = await ReviewService.createReview(studentId, req.body);
    res.status(201).json({
      status: 'success',
      data: { review }
    });
  }
}
