import express from 'express';
import { PatientController } from '../controllers/patient.controller';

const router = express.Router();

router.post('', PatientController.create);
router.get('', PatientController.getAll);
router.get('/search', PatientController.search);
router.get('/:id', PatientController.getById);
router.put('/:id', PatientController.update);
router.delete('/:id', PatientController.delete);

export default router;
