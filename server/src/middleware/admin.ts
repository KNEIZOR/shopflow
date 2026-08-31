import type { RequestHandler } from 'express';

import { prisma } from '../lib/prisma';
import { AppError } from '../errors/app-error';

export const requireAdmin: RequestHandler = async (req, _res, next) => {
    try {
        if (!req.userId) {
            throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
            select: {
                id: true,
                role: true,
            },
        });

        if (!user) {
            throw new AppError(401, 'UNAUTHORIZED', 'User not found');
        }

        if (user.role !== 'ADMIN') {
            throw new AppError(
                403,
                'FORBIDDEN',
                'Administrator access required',
            );
        }

        next();
    } catch (error) {
        next(error);
    }
};
