import { Router } from 'express';
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  applyTemplate,
} from '../controllers/template.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Template routes
router.post('/', createTemplate);
router.get('/', getTemplates);
router.get('/:id', getTemplateById);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);
router.post('/apply', applyTemplate);

export default router; 