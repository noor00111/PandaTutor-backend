import { Request, Response } from 'express';
import { TutorService } from '../services/tutorService';

export class TutorController {
  static async getTutors(req: Request, res: Response) {
    const tutors = await TutorService.getTutors(req.query);
    res.status(200).json({
      status: 'success',
      data: { tutors },
    });
  }

  static async getTutorById(req: Request, res: Response) {
    const { id } = req.params;
    const tutor = await TutorService.getTutorById(id);
    res.status(200).json({
      status: 'success',
      data: { tutor },
    });
  }

  static async updateProfile(req: Request, res: Response) {
    const userId = req.user!.userId;
    const profile = await TutorService.updateProfile(userId, req.body);
    res.status(200).json({
      status: 'success',
      data: { profile }
    });
  }

  static async updateAvailability(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { availabilities } = req.body;
    
    if (!Array.isArray(availabilities)) {
      return res.status(400).json({ status: 'error', message: 'availabilities must be an array' });
    }

    const result = await TutorService.updateAvailability(userId, availabilities);
    res.status(200).json({
      status: 'success',
      data: { availabilities: result }
    });
  }
}
