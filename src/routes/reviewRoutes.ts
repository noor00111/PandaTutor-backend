import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController';
import { requireAuth, requireStudent } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', requireAuth, requireStudent, asyncHandler(ReviewController.createReview));

export default router;
