import { Router } from 'express';
import { DiagnosisController } from '../controllers/diagnosis.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/diagnosis - Get all diagnoses
router.get('/', DiagnosisController.getAllDiagnoses);

// GET /api/diagnosis/search - Search diagnoses
router.get('/search', DiagnosisController.searchDiagnoses);

// GET /api/diagnosis/:id - Get diagnosis by ID
router.get('/:id', DiagnosisController.getDiagnosisById);

// POST /api/diagnosis - Create new diagnosis
router.post('/', DiagnosisController.createDiagnosis);

// PUT /api/diagnosis/:id - Update diagnosis
router.put('/:id', DiagnosisController.updateDiagnosis);

// DELETE /api/diagnosis/:id - Delete diagnosis
router.delete('/:id', DiagnosisController.deleteDiagnosis);

export default router; 