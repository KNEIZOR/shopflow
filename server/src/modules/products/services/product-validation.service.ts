import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

export const ensureProductExists = async (productId: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },

        select: {
            id: true,
            name: true,
            description: true,
            productTypeId: true,
        },
    });

    if (!product) {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }

    return product;
};

export const ensureCategoryExists = async (
    categoryId: string,
): Promise<void> => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },

        select: {
            id: true,
        },
    });

    if (!category) {
        throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
    }
};

export const ensureProductTypeExists = async (
    productTypeId: string,
): Promise<void> => {
    const productType = await prisma.productType.findUnique({
        where: {
            id: productTypeId,
        },

        select: {
            id: true,
        },
    });

    if (!productType) {
        throw new AppError(
            404,
            'PRODUCT_TYPE_NOT_FOUND',
            'Product type not found',
        );
    }
};

export const ensureProductNameOrSlugAvailable = async (
    name?: string,
    slug?: string,
    excludeProductId?: string,
): Promise<void> => {
    if (name === undefined && slug === undefined) {
        return;
    }

    const duplicateProduct = await prisma.product.findFirst({
        where: {
            ...(excludeProductId
                ? {
                      id: {
                          not: excludeProductId,
                      },
                  }
                : {}),

            OR: [
                ...(name
                    ? [
                          {
                              name: {
                                  equals: name,
                                  mode: 'insensitive' as const,
                              },
                          },

                          {
                              translations: {
                                  some: {
                                      language: 'ru',

                                      name: {
                                          equals: name,
                                          mode: 'insensitive' as const,
                                      },
                                  },
                              },
                          },
                      ]
                    : []),

                ...(slug
                    ? [
                          {
                              slug,
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
};

export const ensureNewProductAvailable = async (
    name: string,
    slug: string,
): Promise<void> => {
    await ensureProductNameOrSlugAvailable(name, slug);
};
