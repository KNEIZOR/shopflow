import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

export const removeFavorite = async (userId: string, productId: string) => {
    const favorite = await prisma.favorite.findUnique({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
    });

    if (!favorite) {
        throw new AppError(404, 'FAVORITE_NOT_FOUND', 'Favorite not found');
    }

    await prisma.favorite.delete({
        where: {
            id: favorite.id,
        },
    });
};
