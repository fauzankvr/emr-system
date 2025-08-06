import { Router } from 'express';
import { DoctorController } from '../controllers/doctor.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { upload } from '../utils/multer';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Public Routes
router.post('/login', asyncHandler(DoctorController.login));
router.post('/register', upload.single('profileImage'), asyncHandler(DoctorController.register));

// Protected Routes
router.post('/logout', authMiddleware, asyncHandler(DoctorController.logout));
router.get('/dashboard', authMiddleware, asyncHandler(DoctorController.getDashboard));
router.get('/', asyncHandler(DoctorController.getAll));
router.get('/:id', asyncHandler(DoctorController.getById));
router.put('/:id', asyncHandler(DoctorController.update));
router.delete('/:id', asyncHandler(DoctorController.remove));

export default router;
