import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/users', asyncHandler(AdminController.getUsers));
router.patch('/users/:id', asyncHandler(AdminController.updateUserStatus));

router.get('/bookings', asyncHandler(AdminController.getBookings));

router.get('/categories', asyncHandler(AdminController.getCategories));
router.post('/categories', asyncHandler(AdminController.createCategory));
router.put('/categories/:id', asyncHandler(AdminController.updateCategory));
router.delete('/categories/:id', asyncHandler(AdminController.deleteCategory));

export default router;
