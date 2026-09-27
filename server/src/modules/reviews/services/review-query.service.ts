import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import type { ReviewListQuery } from '../reviews.schema';

import type { ReviewListResponse, ReviewResponse } from '../reviews.types';

const reviewUserSelect = {
    id: true,
    firstName: true,
    lastName: true,
} as const;

const mapReview = (review: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
    };
}): ReviewResponse => {
    return {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        user: review.user,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
    };
};

export const getProductReviews = async (
    productId: string,
    query: ReviewListQuery,
): Promise<ReviewListResponse> => {
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

    const skip = (query.page - 1) * query.limit;

    const [reviews, total, aggregate] = await prisma.$transaction([
        prisma.review.findMany({
            where: {
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
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take: query.limit,
        }),

        prisma.review.count({
            where: {
                productId,
            },
        }),

        prisma.review.aggregate({
            where: {
                productId,
            },
            _avg: {
                rating: true,
            },
            _count: {
                _all: true,
            },
        }),
    ]);

    return {
        items: reviews.map(mapReview),
        pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages: total === 0 ? 0 : Math.ceil(total / query.limit),
        },
        summary: {
            averageRating: aggregate._avg.rating ?? 0,
            count: aggregate._count._all,
        },
    };
};

export const getUserReviewForProduct = async (
    userId: string,
    productId: string,
): Promise<ReviewResponse | null> => {
    const review = await prisma.review.findUnique({
        where: {
            userId_productId: {
                userId,
                productId,
            },
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

    if (!review) {
        return null;
    }

    return mapReview(review);
};
