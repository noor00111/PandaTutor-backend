import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { requireAuth } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/register', asyncHandler(AuthController.register));
router.post('/login', asyncHandler(AuthController.login));
router.get('/me', requireAuth, asyncHandler(AuthController.getMe));
router.delete('/me', requireAuth, asyncHandler(AuthController.deleteMe));

export default router;
