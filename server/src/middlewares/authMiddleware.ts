import { verifyToken } from "../utils/jwt";
import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers.authorization || '';

        const verifiedDetails = verifyToken(token);
        
        if (!verifiedDetails) {
            res.status(401).json({ message: "Invalid or missing authorization token" });
            return;
        }

        req.userId = verifiedDetails.id;
        next();
    } catch (error) {
        console.error("Error occurred in authMiddleware:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
