import { Router } from 'express';
import { TutorController } from '../controllers/tutorController';
import { requireAuth, requireTutor } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(TutorController.getTutors));
router.get('/:id', asyncHandler(TutorController.getTutorById));
router.put('/profile', requireAuth, requireTutor, asyncHandler(TutorController.updateProfile));
router.put('/availability', requireAuth, requireTutor, asyncHandler(TutorController.updateAvailability));

export default router;
