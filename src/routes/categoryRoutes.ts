import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(CategoryController.getCategories));

export default router;
