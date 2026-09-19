import {
    Prisma,
    type CurrencyCode,
    type ProductAttributeScope,
} from '@prisma/client';

const DEFAULT_CURRENCY: CurrencyCode = 'RUB';

const PRODUCT_ATTRIBUTE_SCOPES: ProductAttributeScope[] = ['PRODUCT', 'BOTH'];

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

            attributes: {
                where: {
                    attribute: {
                        scope: {
                            in: PRODUCT_ATTRIBUTE_SCOPES,
                        },
                    },
                },

                select: {
                    id: true,
                    attributeId: true,
                    isRequired: true,
                    position: true,

                    attribute: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            description: true,
                            type: true,
                            scope: true,
                        },
                    },

                    options: {
                        select: {
                            id: true,
                            value: true,
                            label: true,
                            position: true,
                        },

                        orderBy: {
                            position: 'asc' as const,
                        },
                    },
                },

                orderBy: {
                    position: 'asc' as const,
                },
            },
        },
    },

    attributeValues: {
        select: {
            id: true,
            value: true,
            attributeId: true,

            attribute: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    type: true,
                    scope: true,
                },
            },

            createdAt: true,
            updatedAt: true,
        },

        orderBy: {
            attribute: {
                name: 'asc' as const,
            },
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

            attributeValues: {
                select: {
                    id: true,
                    value: true,
                    attributeId: true,

                    attribute: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            description: true,
                            type: true,
                            scope: true,
                        },
                    },
                },

                orderBy: {
                    attribute: {
                        name: 'asc' as const,
                    },
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
