import { type CurrencyCode } from '@prisma/client';

import { prisma } from '../../../lib/prisma';

import { createProductInclude } from '../../products/services/product.include';
import { mapProduct } from '../../products/services/product-mapper.service';

import type { FavoriteItem } from '../favorites.types';

const DEFAULT_LANGUAGE = 'ru';
const DEFAULT_CURRENCY: CurrencyCode = 'RUB';

export const getUserFavorites = async (
    userId: string,
    language = DEFAULT_LANGUAGE,
    currency: CurrencyCode = DEFAULT_CURRENCY,
): Promise<FavoriteItem[]> => {
    const productInclude = createProductInclude(language, currency);

    const favorites = await prisma.favorite.findMany({
        where: {
            userId,

            product: {
                status: 'ACTIVE',
            },
        },

        orderBy: {
            createdAt: 'desc',
        },

        include: {
            product: {
                include: productInclude,
            },
        },
    });

    return favorites.map((favorite) => ({
        id: favorite.id,

        createdAt: favorite.createdAt.toISOString(),

        product: mapProduct(favorite.product, currency),
    }));
};

export const getUserFavorite = async (userId: string, productId: string) => {
    return prisma.favorite.findUnique({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
    });
};
