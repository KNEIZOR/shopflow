import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';

type TokenPayload = {
    userId: string;
};

export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.cookies.shopflow_token;

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });

        return;
    }

    try {
        const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

        req.userId = payload.userId;

        next();
    } catch {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};
