import { Router } from 'express';
import { LabController } from '../controllers/lab.controller';

const router = Router();

// /api/labs/ endpoints
router.get('/', LabController.getAllLabs);
router.post('/login', LabController.loginLab);
router.get('/search', LabController.searchLabs);
router.get('/:id', LabController.getLabById);
// router.post('/', LabController.createLab);
router.put('/:id', LabController.updateLab);
router.patch('/status/:id', LabController.updateLabStatus);
router.delete('/:id', LabController.deleteLab);
router.patch('/report-image/:labReportId', LabController.updateLabReportImage);

export default router; 