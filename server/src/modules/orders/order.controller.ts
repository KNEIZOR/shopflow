import type { Request, Response, NextFunction } from 'express';

import { createOrderSchema, orderIdParamsSchema } from './order.schema';

import { createOrder } from './services/order.service';
import {
    getUserOrderById,
    getUserOrders,
} from './services/order-query.service';

import { AppError } from '../../errors/app-error';

const getAuthenticatedUserId = (req: Request) => {
    if (!req.userId) {
        throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    return req.userId;
};

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const input = createOrderSchema.parse(req.body);

        const order = await createOrder(userId, input);

        res.status(201).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const orders = await getUserOrders(userId);

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};

export const getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const { orderId } = orderIdParamsSchema.parse(req.params);

        const order = await getUserOrderById(userId, orderId);

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};
