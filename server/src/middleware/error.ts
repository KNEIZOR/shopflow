import type { ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

import { AppError } from '../errors/app-error';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    console.error(error);

    if (error instanceof ZodError) {
        res.status(400).json({
            success: false,
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            errors: error.flatten().fieldErrors,
        });

        return;
    }

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            code: error.code,
            message: error.message,
        });

        return;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            res.status(409).json({
                success: false,
                code: 'RESOURCE_ALREADY_EXISTS',
                message: 'A resource with the same unique value already exists',
            });

            return;
        }

        if (error.code === 'P2025') {
            res.status(404).json({
                success: false,
                code: 'RESOURCE_NOT_FOUND',
                message: 'Requested resource was not found',
            });

            return;
        }

        if (error.code === 'P2003') {
            res.status(409).json({
                success: false,
                code: 'RELATED_RESOURCE_CONFLICT',
                message:
                    'The requested operation conflicts with a related resource',
            });

            return;
        }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        res.status(400).json({
            success: false,
            code: 'DATABASE_VALIDATION_ERROR',
            message: 'Invalid database request',
        });

        return;
    }

    res.status(500).json({
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
    });
};
