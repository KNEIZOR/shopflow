import { Prisma, type CurrencyCode } from '@prisma/client';

const DEFAULT_CURRENCY: CurrencyCode = 'RUB';

export const createProductInclude = (
    language: string,
    currency: CurrencyCode,
) => ({
    category: {
        select: {
            id: true,
            name: true,
            slug: true,

            translations: {
                where: {
                    language,
                },

                select: {
                    name: true,
                    description: true,
                },

                take: 1,
            },
        },
    },

    productType: {
        select: {
            id: true,
            name: true,
            slug: true,
        },
    },

    translations: {
        where: {
            language,
        },

        select: {
            name: true,
            description: true,
        },

        take: 1,
    },

    prices: {
        where: {
            currency: {
                in:
                    currency === DEFAULT_CURRENCY
                        ? [DEFAULT_CURRENCY]
                        : [currency, DEFAULT_CURRENCY],
            },
        },

        select: {
            currency: true,
            amount: true,
        },
    },

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
    },

    variants: {
        select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            stock: true,

            prices: {
                where: {
                    currency: {
                        in:
                            currency === DEFAULT_CURRENCY
                                ? [DEFAULT_CURRENCY]
                                : [currency, DEFAULT_CURRENCY],
                    },
                },

                select: {
                    currency: true,
                    amount: true,
                },
            },
        },

        orderBy: {
            name: 'asc' as const,
        },
    },
});

export type ProductWithRelations = Prisma.ProductGetPayload<{
    include: ReturnType<typeof createProductInclude>;
}>;
