import { Router } from 'express';
import { DaysController } from '../controllers/days.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/days - Get all days
router.get('/', DaysController.getAllDays);

// GET /api/days/search - Search days
router.get('/search', DaysController.searchDays);

// GET /api/days/unit/:unit - Get days by unit
router.get('/unit/:unit', DaysController.getDaysByUnit);

// GET /api/days/:id - Get days by ID
router.get('/:id', DaysController.getDaysById);

// POST /api/days - Create new days
router.post('/', DaysController.createDays);

// PUT /api/days/:id - Update days
router.put('/:id', DaysController.updateDays);

// DELETE /api/days/:id - Delete days
router.delete('/:id', DaysController.deleteDays);

export default router; 