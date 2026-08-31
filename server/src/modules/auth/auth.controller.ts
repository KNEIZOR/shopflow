import type { Request, Response, NextFunction } from 'express';

import { loginSchema, registerSchema } from './auth.schema';
import * as authService from './auth.service';

const COOKIE_NAME = 'shopflow_token';

const setAuthCookie = (res: Response, token: string) => {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const input = registerSchema.parse(req.body);

        const result = await authService.register(input);

        setAuthCookie(res, result.token);

        res.status(201).json({
            success: true,
            user: result.user,
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const input = loginSchema.parse(req.body);

        const result = await authService.login(input);

        setAuthCookie(res, result.token);

        res.json({
            success: true,
            user: result.user,
        });
    } catch (error) {
        next(error);
    }
};

export const logout = (_req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME);

    res.json({
        success: true,
        message: 'Logged out successfully',
    });
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });

            return;
        }

        const user = await authService.getUserById(req.userId);

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });

            return;
        }

        res.json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};
