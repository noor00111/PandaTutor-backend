import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { requireAuth, requireStudent } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(requireAuth);

router.post('/', requireStudent, asyncHandler(BookingController.createBooking));
router.get('/', asyncHandler(BookingController.getBookings));
router.get('/:id', asyncHandler(BookingController.getBookingById));
router.put('/:id/status', asyncHandler(BookingController.updateStatus));

export default router;
