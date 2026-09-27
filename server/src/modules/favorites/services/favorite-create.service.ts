import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import { getUserFavorite } from './favorite-query.service';

export const addFavorite = async (userId: string, productId: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
            status: true,
        },
    });

    if (!product) {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }

    if (product.status !== 'ACTIVE') {
        throw new AppError(
            400,
            'PRODUCT_NOT_AVAILABLE',
            'Product is not available',
        );
    }

    const existingFavorite = await getUserFavorite(userId, productId);

    if (existingFavorite) {
        return existingFavorite;
    }

    return prisma.favorite.create({
        data: {
            userId,
            productId,
        },
    });
};
