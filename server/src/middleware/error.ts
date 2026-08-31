import type { ErrorRequestHandler } from 'express';
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

    res.status(500).json({
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
    });
};
