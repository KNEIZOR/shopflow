import type { Request, Response, NextFunction } from 'express';

import { AppError } from '../../errors/app-error';

import {
    addCartItemSchema,
    cartItemParamsSchema,
    updateCartItemSchema,
} from './cart.schema';

import { getUserCart } from './services/cart.service';

import {
    addCartItem,
    clearCart,
    removeCartItem,
    updateCartItem,
} from './services/cart-item.service';

const getAuthenticatedUserId = (req: Request): string => {
    if (!req.userId) {
        throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    return req.userId;
};

export const getCart = async (req: Request, res: Response) => {
    const userId = getAuthenticatedUserId(req);

    const cart = await getUserCart(userId);

    res.status(200).json({
        success: true,
        data: cart,
    });
};

export const addItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const input = addCartItemSchema.parse(req.body);

        const item = await addCartItem(userId, input);

        res.status(201).json({
            success: true,
            data: item,
        });
    } catch (error) {
        next(error);
    }
};

export const updateItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const { itemId } = cartItemParamsSchema.parse(req.params);

        const input = updateCartItemSchema.parse(req.body);

        const item = await updateCartItem(userId, itemId, input);

        res.status(200).json({
            success: true,
            data: item,
        });
    } catch (error) {
        next(error);
    }
};

export const removeItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const { itemId } = cartItemParamsSchema.parse(req.params);

        await removeCartItem(userId, itemId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const removeAllItems = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        await clearCart(userId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
