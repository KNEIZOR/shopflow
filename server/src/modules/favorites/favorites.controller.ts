import type { Request, Response } from 'express';
import { type CurrencyCode } from '@prisma/client';

import { AppError } from '../../errors/app-error';

import { favoriteProductParamsSchema } from './favorites.schema';

import { addFavorite } from './services/favorite-create.service';
import { removeFavorite } from './services/favorite-delete.service';
import { getUserFavorites } from './services/favorite-query.service';

const DEFAULT_LANGUAGE = 'ru';
const DEFAULT_CURRENCY: CurrencyCode = 'RUB';

const getAuthenticatedUserId = (req: Request): string => {
    if (!req.userId) {
        throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    return req.userId;
};

const getLanguage = (req: Request): string => {
    const language = req.query.language;

    if (typeof language !== 'string' || !language.trim()) {
        return DEFAULT_LANGUAGE;
    }

    return language;
};

const getCurrency = (req: Request): CurrencyCode => {
    const currency = req.query.currency;

    if (currency === 'RUB' || currency === 'USD' || currency === 'EUR') {
        return currency;
    }

    return DEFAULT_CURRENCY;
};

export const getFavorites = async (
    req: Request,
    res: Response,
    next: (error?: unknown) => void,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const favorites = await getUserFavorites(
            userId,
            getLanguage(req),
            getCurrency(req),
        );

        res.status(200).json({
            success: true,
            data: favorites,
        });
    } catch (error) {
        next(error);
    }
};

export const createFavorite = async (
    req: Request,
    res: Response,
    next: (error?: unknown) => void,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const { productId } = favoriteProductParamsSchema.parse(req.params);

        const favorite = await addFavorite(userId, productId);

        res.status(201).json({
            success: true,
            data: favorite,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteFavorite = async (
    req: Request,
    res: Response,
    next: (error?: unknown) => void,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const { productId } = favoriteProductParamsSchema.parse(req.params);

        await removeFavorite(userId, productId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
