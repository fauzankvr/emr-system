import jwt from 'jsonwebtoken';

export interface TokenPayload {
    id: string;
    email: string;
    role?: string;
}

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const ACCESS_TOKEN_EXPIRATION = '15m'; // Short lived access token
const REFRESH_TOKEN_EXPIRATION = '7d'; // Long lived refresh token

export const generateAccessToken = (payload: object): string => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRATION });
};

export const generateRefreshToken = (payload: object): string => {
    return jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRATION });
};

export const generateToken = (payload: object): { accessToken: string; refreshToken: string } => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error('Invalid access token:', error);
        return null;
    }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
    try {
        const decoded = jwt.verify(token, REFRESH_SECRET_KEY) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error('Invalid refresh token:', error);
        return null;
    }
};

export const verifyToken = (token: string): TokenPayload | null => {
    return verifyAccessToken(token);
};

export const decodeToken = (token: string): null | { [key: string]: any } => {
    return jwt.decode(token) as { [key: string]: any } | null;
};