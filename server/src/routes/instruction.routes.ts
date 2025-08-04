import { Router } from 'express';
import { InstructionController } from '../controllers/instruction.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/instruction - Get all instructions
router.get('/', InstructionController.getAllInstructions);

// GET /api/instruction/search - Search instructions
router.get('/search', InstructionController.searchInstructions);

// GET /api/instruction/category/:category - Get instructions by category
router.get('/category/:category', InstructionController.getInstructionsByCategory);

// GET /api/instruction/:id - Get instruction by ID
router.get('/:id', InstructionController.getInstructionById);

// POST /api/instruction - Create new instruction
router.post('/', InstructionController.createInstruction);

// PUT /api/instruction/:id - Update instruction
router.put('/:id', InstructionController.updateInstruction);

// DELETE /api/instruction/:id - Delete instruction
router.delete('/:id', InstructionController.deleteInstruction);

export default router; 