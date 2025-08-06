import { RefreshTokenModel, IRefreshToken } from '../models/refreshToken.model';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import mongoose from 'mongoose';

export class RefreshTokenService {
    static async createRefreshToken(userId: string, token: string, expiresAt: Date): Promise<IRefreshToken> {
        return await RefreshTokenModel.create({
            userId: new mongoose.Types.ObjectId(userId),
            token,
            expiresAt
        });
    }

    static async findRefreshToken(token: string): Promise<IRefreshToken | null> {
        return await RefreshTokenModel.findOne({ 
            token, 
            isRevoked: false,
            expiresAt: { $gt: new Date() }
        });
    }

    static async revokeRefreshToken(token: string): Promise<void> {
        await RefreshTokenModel.updateOne(
            { token },
            { isRevoked: true }
        );
    }

    static async revokeAllUserTokens(userId: string): Promise<void> {
        await RefreshTokenModel.updateMany(
            { userId: new mongoose.Types.ObjectId(userId) },
            { isRevoked: true }
        );
    }

    static async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
        try {
            // Verify the refresh token
            const decoded = verifyRefreshToken(refreshToken);
            if (!decoded) {
                return null;
            }

            // Check if refresh token exists in database and is not revoked
            const storedToken = await this.findRefreshToken(refreshToken);
            if (!storedToken) {
                return null;
            }

            // Generate new tokens
            const newAccessToken = generateAccessToken({ 
                id: decoded.id, 
                email: decoded.email,
                role: decoded.role 
            });
            
            const newRefreshToken = generateRefreshToken({ 
                id: decoded.id, 
                email: decoded.email,
                role: decoded.role 
            });

            // Revoke old refresh token
            await this.revokeRefreshToken(refreshToken);

            // Store new refresh token
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
            
            await this.createRefreshToken(decoded.id, newRefreshToken, expiresAt);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            };
        } catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    }
} 