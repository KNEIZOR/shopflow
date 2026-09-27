import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

export const deleteReview = async (
    userId: string,
    reviewId: string,
): Promise<void> => {
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
            'You can only delete your own review',
        );
    }

    await prisma.review.delete({
        where: {
            id: reviewId,
        },
    });
};
