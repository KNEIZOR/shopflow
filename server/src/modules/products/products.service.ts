import { Prisma } from '@prisma/client';

import { prisma } from '../../lib/prisma';
import { AppError } from '../../errors/app-error';

import type {
    CreateProductInput,
    ProductListQuery,
    UpdateProductInput,
} from './products.schema';

import type { ProductListResponse, ProductResponse } from './products.types';

const productInclude = {
    category: {
        select: {
            id: true,
            name: true,
            slug: true,
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
        },
        orderBy: {
            name: 'asc' as const,
        },
    },
};

type ProductWithRelations = Prisma.ProductGetPayload<{
    include: typeof productInclude;
}>;

const mapProduct = (product: ProductWithRelations): ProductResponse => {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price.toFixed(2),
        status: product.status,

        category: {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
        },

        images: product.images.map((image) => ({
            id: image.id,
            url: image.url,
            alt: image.alt,
            position: image.position,
        })),

        variants: product.variants.map((variant) => ({
            id: variant.id,
            name: variant.name,
            sku: variant.sku,
            price: variant.price === null ? null : variant.price.toFixed(2),
            stock: variant.stock,
        })),

        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
};

const getOrderBy = (
    sort: ProductListQuery['sort'],
): Prisma.ProductOrderByWithRelationInput => {
    switch (sort) {
        case 'oldest':
            return {
                createdAt: 'asc',
            };

        case 'price_asc':
            return {
                price: 'asc',
            };

        case 'price_desc':
            return {
                price: 'desc',
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

export const getProducts = async (
    query: ProductListQuery,
    isAdmin = false,
): Promise<ProductListResponse> => {
    const { page, limit, search, category, status, minPrice, maxPrice, sort } =
        query;

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

        ...(minPrice !== undefined || maxPrice !== undefined
            ? {
                  price: {
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
              }
            : {}),
    };

    const skip = (page - 1) * limit;

    const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
            where,
            include: productInclude,
            orderBy: getOrderBy(sort),
            skip,
            take: limit,
        }),

        prisma.product.count({
            where,
        }),
    ]);

    return {
        items: products.map(mapProduct),
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
): Promise<ProductResponse> => {
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

    return mapProduct(product);
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

    const product = await prisma.product.create({
        data: {
            name: input.name,
            slug: input.slug,
            description: input.description,
            price: new Prisma.Decimal(input.price.toFixed(2)),
            status: input.status,
            categoryId: input.categoryId,
        },
        include: productInclude,
    });

    return mapProduct(product);
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
        data.price = new Prisma.Decimal(input.price.toFixed(2));
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

    const product = await prisma.product.update({
        where: {
            id,
        },
        data,
        include: productInclude,
    });

    return mapProduct(product);
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
