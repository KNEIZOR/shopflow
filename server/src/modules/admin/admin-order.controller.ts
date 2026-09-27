import type { NextFunction, Request, Response } from 'express';

import {
    adminOrderIdParamsSchema,
    adminOrderListQuerySchema,
    updateAdminOrderStatusSchema,
} from './admin-order.schema';

import {
    getAdminOrderById,
    getAdminOrders,
    updateAdminOrderStatus,
} from './services/admin-order.service';

export const getOrders = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const query = adminOrderListQuerySchema.parse(req.query);

        const result = await getAdminOrders(query);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { orderId } = adminOrderIdParamsSchema.parse(req.params);

        const order = await getAdminOrderById(orderId);

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { orderId } = adminOrderIdParamsSchema.parse(req.params);

        const input = updateAdminOrderStatusSchema.parse(req.body);

        const order = await updateAdminOrderStatus(orderId, input);

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};
