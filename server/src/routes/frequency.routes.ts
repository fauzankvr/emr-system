import { Router } from 'express';
import { FrequencyController } from '../controllers/frequency.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/frequency - Get all frequencies
router.get('/', FrequencyController.getAllFrequencies);

// GET /api/frequency/search - Search frequencies
router.get('/search', FrequencyController.searchFrequencies);

// GET /api/frequency/:id - Get frequency by ID
router.get('/:id', FrequencyController.getFrequencyById);

// POST /api/frequency - Create new frequency
router.post('/', FrequencyController.createFrequency);

// PUT /api/frequency/:id - Update frequency
router.put('/:id', FrequencyController.updateFrequency);

// DELETE /api/frequency/:id - Delete frequency
router.delete('/:id', FrequencyController.deleteFrequency);

export default router; 