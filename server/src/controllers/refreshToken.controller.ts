import { Request, Response } from 'express';
import { RefreshTokenService } from '../services/refreshToken.service';
import { HttpStatusCode } from '../constants/statusCodes';

export class RefreshTokenController {
    static async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({
                    message: 'Refresh token is required'
                });
            }

            const result = await RefreshTokenService.refreshAccessToken(refreshToken);

            if (!result) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({
                    message: 'Invalid or expired refresh token'
                });
            }

            res.status(HttpStatusCode.OK).json({
                message: 'Token refreshed successfully',
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            });
        } catch (error: any) {
            console.error('Error in refresh token controller:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    static async revokeToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({
                    message: 'Refresh token is required'
                });
            }

            await RefreshTokenService.revokeRefreshToken(refreshToken);

            res.status(HttpStatusCode.OK).json({
                message: 'Token revoked successfully'
            });
        } catch (error: any) {
            console.error('Error in revoke token controller:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error',
                error: error.message
            });
        }
    }
} 