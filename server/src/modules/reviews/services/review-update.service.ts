import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import type { UpdateReviewInput } from '../reviews.schema';
import type { ReviewResponse } from '../reviews.types';

const reviewUserSelect = {
    id: true,
    firstName: true,
    lastName: true,
} as const;

export const updateReview = async (
    userId: string,
    reviewId: string,
    input: UpdateReviewInput,
): Promise<ReviewResponse> => {
    const review = await prisma.review.findUnique({
        where: {
            id: reviewId,
        },
        select: {
            id: true,
            userId: true,
        },
    });

    if (!review) {
        throw new AppError(404, 'REVIEW_NOT_FOUND', 'Review not found');
    }

    if (review.userId !== userId) {
        throw new AppError(
            403,
            'FORBIDDEN',
            'You can only update your own review',
        );
    }

    if (input.rating === undefined && input.comment === undefined) {
        throw new AppError(
            400,
            'REVIEW_UPDATE_EMPTY',
            'At least one review field is required',
        );
    }

    const updatedReview = await prisma.review.update({
        where: {
            id: reviewId,
        },
        data: {
            ...(input.rating !== undefined && {
                rating: input.rating,
            }),
            ...(input.comment !== undefined && {
                comment: input.comment,
            }),
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

    return updatedReview;
};
