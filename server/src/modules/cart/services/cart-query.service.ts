import { prisma } from '../../../lib/prisma';

const cartItemInclude = {
    product: {
        select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            price: true,

            images: {
                select: {
                    id: true,
                    url: true,
                    alt: true,
                    position: true,
                },

                orderBy: {
                    position: 'asc' as const,
                },

                take: 1,
            },
        },
    },

    variant: {
        select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            stock: true,

            prices: {
                select: {
                    currency: true,
                    amount: true,
                },

                orderBy: {
                    currency: 'asc',
                },
            },
        },
    },
} as const;

export const getCartByUserId = async (userId: string) => {
    return prisma.cart.findUnique({
        where: {
            userId,
        },

        select: {
            id: true,

            items: {
                include: cartItemInclude,

                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
    });
};
