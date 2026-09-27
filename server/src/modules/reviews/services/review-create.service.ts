import { Prisma } from '@prisma/client';

import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import type { CreateReviewInput } from '../reviews.schema';
import type { ReviewResponse } from '../reviews.types';

const reviewUserSelect = {
    id: true,
    firstName: true,
    lastName: true,
} as const;

export const createReview = async (
    userId: string,
    productId: string,
    input: CreateReviewInput,
): Promise<ReviewResponse> => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
        },
    });

    if (!product) {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }

    const existingReview = await prisma.review.findUnique({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
        select: {
            id: true,
        },
    });

    if (existingReview) {
        throw new AppError(
            409,
            'REVIEW_ALREADY_EXISTS',
            'You have already reviewed this product',
        );
    }

    try {
        const review = await prisma.review.create({
            data: {
                rating: input.rating,
                comment: input.comment ?? null,
                userId,
                productId,
            },
            select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: reviewUserSelect,
                },
            },
        });

        return review;
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            throw new AppError(
                409,
                'REVIEW_ALREADY_EXISTS',
                'You have already reviewed this product',
            );
        }

        throw error;
    }
};
