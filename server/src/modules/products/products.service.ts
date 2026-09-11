import { Prisma, type CurrencyCode } from '@prisma/client';

import { prisma } from '../../lib/prisma';
import { AppError } from '../../errors/app-error';

import type {
    CreateProductInput,
    ProductListQuery,
    UpdateProductInput,
} from './products.schema';

import type { ProductListResponse, ProductResponse } from './products.types';

const DEFAULT_LANGUAGE = 'ru';
const DEFAULT_CURRENCY: CurrencyCode = 'RUB';

const createProductInclude = (language: string, currency: CurrencyCode) => ({
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

type ProductWithRelations = Prisma.ProductGetPayload<{
    include: ReturnType<typeof createProductInclude>;
}>;

type ProductPriceRelation = ProductWithRelations['prices'][number];

type ProductVariantRelation = ProductWithRelations['variants'][number];

const getTranslation = (translations: ProductWithRelations['translations']) => {
    return translations[0] ?? null;
};

const getPriceForCurrency = (
    prices: ProductPriceRelation[],
    currency: CurrencyCode,
): ProductPriceRelation | null => {
    return prices.find((price) => price.currency === currency) ?? null;
};

const getFallbackRubPrice = (
    prices: ProductPriceRelation[],
): ProductPriceRelation | null => {
    return prices.find((price) => price.currency === DEFAULT_CURRENCY) ?? null;
};

const getVariantPriceForCurrency = (
    prices: ProductVariantRelation['prices'],
    currency: CurrencyCode,
) => {
    return prices.find((price) => price.currency === currency) ?? null;
};

const getVariantFallbackRubPrice = (
    prices: ProductVariantRelation['prices'],
) => {
    return prices.find((price) => price.currency === DEFAULT_CURRENCY) ?? null;
};

const getProductDisplayPrice = (
    product: ProductWithRelations,
    currency: CurrencyCode,
) => {
    const requestedPrice = getPriceForCurrency(product.prices, currency);

    if (requestedPrice) {
        return requestedPrice;
    }

    const rubPrice = getFallbackRubPrice(product.prices);

    if (rubPrice) {
        return rubPrice;
    }

    return {
        amount: product.price,
        currency: DEFAULT_CURRENCY,
    };
};

const getVariantDisplayPrice = (
    variant: ProductVariantRelation,
    currency: CurrencyCode,
) => {
    const requestedPrice = getVariantPriceForCurrency(variant.prices, currency);

    if (requestedPrice) {
        return requestedPrice;
    }

    const rubPrice = getVariantFallbackRubPrice(variant.prices);

    if (rubPrice) {
        return rubPrice;
    }

    if (variant.price !== null) {
        return {
            amount: variant.price,
            currency: DEFAULT_CURRENCY,
        };
    }

    return null;
};

const mapProduct = (
    product: ProductWithRelations,
    currency: CurrencyCode,
): ProductResponse => {
    const translation = getTranslation(product.translations);

    const displayPrice = getProductDisplayPrice(product, currency);

    const name = translation?.name ?? product.name;

    const description = translation?.description ?? product.description;

    return {
        id: product.id,

        name,

        slug: product.slug,

        description,

        price: displayPrice.amount.toFixed(2),

        currency: displayPrice.currency,

        status: product.status,

        category: {
            id: product.category.id,

            name:
                product.category.translations[0]?.name ?? product.category.name,

            slug: product.category.slug,
        },

        images: product.images.map((image) => ({
            id: image.id,
            url: image.url,
            alt: image.alt,
            position: image.position,
        })),

        variants: product.variants.map((variant) => {
            const displayVariantPrice = getVariantDisplayPrice(
                variant,
                currency,
            );

            return {
                id: variant.id,

                name: variant.name,

                sku: variant.sku,

                price: displayVariantPrice?.amount.toFixed(2) ?? null,

                currency: displayVariantPrice?.currency ?? DEFAULT_CURRENCY,

                stock: variant.stock,
            };
        }),

        createdAt: product.createdAt,

        updatedAt: product.updatedAt,
    };
};

const buildPriceFilter = (
    minPrice: number | undefined,
    maxPrice: number | undefined,
    currency: CurrencyCode,
): Prisma.ProductWhereInput => {
    if (minPrice === undefined && maxPrice === undefined) {
        return {};
    }

    return {
        prices: {
            some: {
                currency,

                amount: {
                    ...(minPrice !== undefined
                        ? {
                              gte: minPrice,
                          }
                        : {}),

                    ...(maxPrice !== undefined
                        ? {
                              lte: maxPrice,
                          }
                        : {}),
                },
            },
        },
    };
};

const getDatabaseOrderBy = (
    sort: ProductListQuery['sort'],
): Prisma.ProductOrderByWithRelationInput => {
    switch (sort) {
        case 'oldest':
            return {
                createdAt: 'asc',
            };

        case 'name_asc':
            return {
                name: 'asc',
            };

        case 'name_desc':
            return {
                name: 'desc',
            };

        case 'newest':
        default:
            return {
                createdAt: 'desc',
            };
    }
};

const sortProductsByPrice = (
    products: ProductWithRelations[],
    currency: CurrencyCode,
    direction: 'asc' | 'desc',
) => {
    return [...products].sort((first, second) => {
        const firstPrice = getProductDisplayPrice(first, currency);

        const secondPrice = getProductDisplayPrice(second, currency);

        const comparison = firstPrice.amount.comparedTo(secondPrice.amount);

        return direction === 'asc' ? comparison : -comparison;
    });
};

const getProductsByPrice = async (
    where: Prisma.ProductWhereInput,
    currency: CurrencyCode,
    direction: 'asc' | 'desc',
    page: number,
    limit: number,
    productInclude: ReturnType<typeof createProductInclude>,
) => {
    const products = await prisma.product.findMany({
        where,

        include: productInclude,

        orderBy: {
            createdAt: 'desc',
        },
    });

    const sortedProducts = sortProductsByPrice(products, currency, direction);

    const skip = (page - 1) * limit;

    return {
        products: sortedProducts.slice(skip, skip + limit),

        total: sortedProducts.length,
    };
};

export const getProducts = async (
    query: ProductListQuery,
    isAdmin = false,
): Promise<ProductListResponse> => {
    const {
        page,
        limit,
        search,
        category,
        status,
        minPrice,
        maxPrice,
        sort,
        language = DEFAULT_LANGUAGE,
        currency = DEFAULT_CURRENCY,
    } = query;

    if (
        minPrice !== undefined &&
        maxPrice !== undefined &&
        minPrice > maxPrice
    ) {
        throw new AppError(
            400,
            'INVALID_PRICE_RANGE',
            'Minimum price cannot be greater than maximum price',
        );
    }

    const productInclude = createProductInclude(language, currency);

    const where: Prisma.ProductWhereInput = {
        ...(isAdmin
            ? status
                ? {
                      status,
                  }
                : {}
            : {
                  status: 'ACTIVE',
              }),

        ...(search
            ? {
                  OR: [
                      {
                          name: {
                              contains: search,
                              mode: 'insensitive',
                          },
                      },

                      {
                          description: {
                              contains: search,
                              mode: 'insensitive',
                          },
                      },

                      {
                          translations: {
                              some: {
                                  language,

                                  OR: [
                                      {
                                          name: {
                                              contains: search,
                                              mode: 'insensitive',
                                          },
                                      },

                                      {
                                          description: {
                                              contains: search,
                                              mode: 'insensitive',
                                          },
                                      },
                                  ],
                              },
                          },
                      },
                  ],
              }
            : {}),

        ...(category
            ? {
                  category: {
                      slug: category,
                  },
              }
            : {}),

        ...buildPriceFilter(minPrice, maxPrice, currency),
    };

    const isPriceSort = sort === 'price_asc' || sort === 'price_desc';

    if (isPriceSort) {
        const { products, total } = await getProductsByPrice(
            where,
            currency,
            sort === 'price_asc' ? 'asc' : 'desc',
            page,
            limit,
            productInclude,
        );

        return {
            items: products.map((product) => mapProduct(product, currency)),

            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
            where,

            include: productInclude,

            orderBy: getDatabaseOrderBy(sort),

            skip,
            take: limit,
        }),

        prisma.product.count({
            where,
        }),
    ]);

    return {
        items: products.map((product) => mapProduct(product, currency)),

        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getProductBySlug = async (
    slug: string,
    isAdmin = false,
    language = DEFAULT_LANGUAGE,
    currency: CurrencyCode = DEFAULT_CURRENCY,
): Promise<ProductResponse> => {
    const productInclude = createProductInclude(language, currency);

    const product = await prisma.product.findUnique({
        where: {
            slug,
        },

        include: productInclude,
    });

    if (!product) {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }

    if (!isAdmin && product.status !== 'ACTIVE') {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }

    return mapProduct(product, currency);
};

export const createProduct = async (
    input: CreateProductInput,
): Promise<ProductResponse> => {
    const [existingProduct, category] = await Promise.all([
        prisma.product.findFirst({
            where: {
                OR: [
                    {
                        slug: input.slug,
                    },

                    {
                        name: {
                            equals: input.name,
                            mode: 'insensitive',
                        },
                    },

                    {
                        translations: {
                            some: {
                                language: DEFAULT_LANGUAGE,

                                name: {
                                    equals: input.name,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    },
                ],
            },

            select: {
                id: true,
            },
        }),

        prisma.category.findUnique({
            where: {
                id: input.categoryId,
            },

            select: {
                id: true,
            },
        }),
    ]);

    if (existingProduct) {
        throw new AppError(
            409,
            'PRODUCT_ALREADY_EXISTS',
            'Product with this name or slug already exists',
        );
    }

    if (!category) {
        throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
    }

    const product = await prisma.$transaction(async (tx) => {
        const price = new Prisma.Decimal(input.price.toFixed(2));

        const createdProduct = await tx.product.create({
            data: {
                name: input.name,

                slug: input.slug,

                description: input.description,

                price,

                status: input.status,

                categoryId: input.categoryId,
            },
        });

        await tx.productTranslation.create({
            data: {
                productId: createdProduct.id,

                language: DEFAULT_LANGUAGE,

                name: input.name,

                description: input.description,
            },
        });

        await tx.productPrice.create({
            data: {
                productId: createdProduct.id,

                currency: DEFAULT_CURRENCY,

                amount: price,
            },
        });

        return tx.product.findUniqueOrThrow({
            where: {
                id: createdProduct.id,
            },

            include: createProductInclude(DEFAULT_LANGUAGE, DEFAULT_CURRENCY),
        });
    });

    return mapProduct(product, DEFAULT_CURRENCY);
};

export const updateProduct = async (
    id: string,
    input: UpdateProductInput,
): Promise<ProductResponse> => {
    const existingProduct = await prisma.product.findUnique({
        where: {
            id,
        },

        select: {
            id: true,
            name: true,
            description: true,
        },
    });

    if (!existingProduct) {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }

    if (input.categoryId) {
        const category = await prisma.category.findUnique({
            where: {
                id: input.categoryId,
            },

            select: {
                id: true,
            },
        });

        if (!category) {
            throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
        }
    }

    if (input.name || input.slug) {
        const duplicateProduct = await prisma.product.findFirst({
            where: {
                id: {
                    not: id,
                },

                OR: [
                    ...(input.name
                        ? [
                              {
                                  name: {
                                      equals: input.name,
                                      mode: 'insensitive' as const,
                                  },
                              },

                              {
                                  translations: {
                                      some: {
                                          language: DEFAULT_LANGUAGE,

                                          name: {
                                              equals: input.name,
                                              mode: 'insensitive' as const,
                                          },
                                      },
                                  },
                              },
                          ]
                        : []),

                    ...(input.slug
                        ? [
                              {
                                  slug: input.slug,
                              },
                          ]
                        : []),
                ],
            },

            select: {
                id: true,
            },
        });

        if (duplicateProduct) {
            throw new AppError(
                409,
                'PRODUCT_ALREADY_EXISTS',
                'Product with this name or slug already exists',
            );
        }
    }

    await prisma.$transaction(async (tx) => {
        const data: Prisma.ProductUpdateInput = {};

        if (input.name !== undefined) {
            data.name = input.name;
        }

        if (input.slug !== undefined) {
            data.slug = input.slug;
        }

        if (input.description !== undefined) {
            data.description = input.description;
        }

        if (input.price !== undefined) {
            const price = new Prisma.Decimal(input.price.toFixed(2));

            data.price = price;

            await tx.productPrice.upsert({
                where: {
                    productId_currency: {
                        productId: id,

                        currency: DEFAULT_CURRENCY,
                    },
                },

                update: {
                    amount: price,
                },

                create: {
                    productId: id,

                    currency: DEFAULT_CURRENCY,

                    amount: price,
                },
            });
        }

        if (input.status !== undefined) {
            data.status = input.status;
        }

        if (input.categoryId !== undefined) {
            data.category = {
                connect: {
                    id: input.categoryId,
                },
            };
        }

        if (Object.keys(data).length > 0) {
            await tx.product.update({
                where: {
                    id,
                },

                data,
            });
        }

        if (input.name !== undefined || input.description !== undefined) {
            await tx.productTranslation.upsert({
                where: {
                    productId_language: {
                        productId: id,

                        language: DEFAULT_LANGUAGE,
                    },
                },

                update: {
                    ...(input.name !== undefined
                        ? {
                              name: input.name,
                          }
                        : {}),

                    ...(input.description !== undefined
                        ? {
                              description: input.description,
                          }
                        : {}),
                },

                create: {
                    productId: id,

                    language: DEFAULT_LANGUAGE,

                    name: input.name ?? existingProduct.name,

                    description:
                        input.description ?? existingProduct.description,
                },
            });
        }
    });

    const product = await prisma.product.findUnique({
        where: {
            id,
        },

        include: createProductInclude(DEFAULT_LANGUAGE, DEFAULT_CURRENCY),
    });

    if (!product) {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }

    return mapProduct(product, DEFAULT_CURRENCY);
};

export const deleteProduct = async (id: string): Promise<void> => {
    const product = await prisma.product.findUnique({
        where: {
            id,
        },

        select: {
            id: true,
        },
    });

    if (!product) {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }

    try {
        await prisma.product.delete({
            where: {
                id,
            },
        });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2003'
        ) {
            throw new AppError(
                409,
                'PRODUCT_CANNOT_BE_DELETED',
                'Product cannot be deleted because it is used by existing records',
            );
        }

        throw error;
    }
};
