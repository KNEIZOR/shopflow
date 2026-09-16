import { Prisma, type CurrencyCode } from '@prisma/client';

import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import type { ProductListQuery } from '../products.schema';

import type { ProductListResponse, ProductResponse } from '../products.types';

import { createProductInclude } from './product.include';

import { mapProduct } from './product-mapper.service';

import { sortProductsByPrice } from './product-price.service';

const DEFAULT_LANGUAGE = 'ru';

const DEFAULT_CURRENCY: CurrencyCode = 'RUB';

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

const buildProductWhere = (
    query: ProductListQuery,
    isAdmin: boolean,
): Prisma.ProductWhereInput => {
    const {
        search,
        category,
        status,
        minPrice,
        maxPrice,
        currency = DEFAULT_CURRENCY,
        language = DEFAULT_LANGUAGE,
    } = query;

    return {
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

export const getProducts = async (
    query: ProductListQuery,
    isAdmin = false,
): Promise<ProductListResponse> => {
    const {
        page,
        limit,
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

    const where = buildProductWhere(query, isAdmin);

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
