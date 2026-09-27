import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../../errors/app-error';

import {
    createReviewSchema,
    productReviewsParamsSchema,
    reviewIdParamsSchema,
    reviewListQuerySchema,
    updateReviewSchema,
} from './reviews.schema';

import * as reviewService from './reviews.service';

const getAuthenticatedUserId = (req: Request): string => {
    if (!req.userId) {
        throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    return req.userId;
};

export const getProductReviews = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId } = productReviewsParamsSchema.parse(req.params);

        const query = reviewListQuerySchema.parse(req.query);

        const reviews = await reviewService.getProductReviews(productId, query);

        res.status(200).json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyProductReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const { productId } = productReviewsParamsSchema.parse(req.params);

        const review = await reviewService.getUserReviewForProduct(
            userId,
            productId,
        );

        res.status(200).json({
            success: true,
            data: review,
        });
    } catch (error) {
        next(error);
    }
};

export const createReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const { productId } = productReviewsParamsSchema.parse(req.params);

        const input = createReviewSchema.parse(req.body);

        const review = await reviewService.createReview(
            userId,
            productId,
            input,
        );

        res.status(201).json({
            success: true,
            data: review,
        });
    } catch (error) {
        next(error);
    }
};

export const updateReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const { reviewId } = reviewIdParamsSchema.parse(req.params);

        const input = updateReviewSchema.parse(req.body);

        const review = await reviewService.updateReview(
            userId,
            reviewId,
            input,
        );

        res.status(200).json({
            success: true,
            data: review,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const { reviewId } = reviewIdParamsSchema.parse(req.params);

        await reviewService.deleteReview(userId, reviewId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
