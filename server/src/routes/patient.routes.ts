import express from 'express';
import { PatientController } from '../controllers/patient.controller';
import { uploadIdCard } from '../utils/multer';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.post('', PatientController.create);
router.get('', PatientController.getAll);
router.get('/search', PatientController.search);
router.get('/:id', PatientController.getById);
router.put('/:id', PatientController.update);
router.delete('/:id', PatientController.delete);
router.patch('/:id/vitals', PatientController.updateVitals);
router.post(
  '/:id/card',
  uploadIdCard.single('cardFile'),   // field name expected from FE
asyncHandler(PatientController.uploadIdCard)
);

export default router;
