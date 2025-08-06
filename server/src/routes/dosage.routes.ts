import { Router } from 'express';
import { DosageController } from '../controllers/dosage.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/dosage - Get all dosages
router.get('/', DosageController.getAllDosages);

// GET /api/dosage/search - Search dosages
router.get('/search', DosageController.searchDosages);

// GET /api/dosage/:id - Get dosage by ID
router.get('/:id', DosageController.getDosageById);

// POST /api/dosage - Create new dosage
router.post('/', DosageController.createDosage);

// PUT /api/dosage/:id - Update dosage
router.put('/:id', DosageController.updateDosage);

// DELETE /api/dosage/:id - Delete dosage
router.delete('/:id', DosageController.deleteDosage);

export default router; 