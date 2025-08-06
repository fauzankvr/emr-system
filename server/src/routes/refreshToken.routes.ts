import { Router } from 'express';
import { RefreshTokenController } from '../controllers/refreshToken.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Public routes for token management
router.post('/refresh', asyncHandler(RefreshTokenController.refreshToken));
router.post('/revoke', asyncHandler(RefreshTokenController.revokeToken));

export default router; 