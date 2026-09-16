import { Prisma } from '@prisma/client';

import { prisma } from '../../lib/prisma';
import { AppError } from '../../errors/app-error';

import type {
    CreateProductTypeInput,
    UpdateProductTypeInput,
} from './product-types.schema';

import type {
    ProductTypeListResponse,
    ProductTypeResponse,
} from './product-types.types';

const productTypeInclude = {
    attributes: {
        orderBy: {
            position: 'asc' as const,
        },

        include: {
            attribute: true,

            options: {
                orderBy: {
                    position: 'asc' as const,
                },
            },
        },
    },
};

type ProductTypeWithRelations = Prisma.ProductTypeGetPayload<{
    include: typeof productTypeInclude;
}>;

const mapProductType = (
    productType: ProductTypeWithRelations,
): ProductTypeResponse => ({
    id: productType.id,

    name: productType.name,

    slug: productType.slug,

    description: productType.description,

    attributes: productType.attributes.map((relation) => ({
        id: relation.id,

        attributeId: relation.attributeId,

        name: relation.attribute.name,

        slug: relation.attribute.slug,

        description: relation.attribute.description,

        type: relation.attribute.type,

        scope: relation.attribute.scope,

        isRequired: relation.isRequired,

        position: relation.position,

        options: relation.options.map((option) => ({
            id: option.id,

            value: option.value,

            label: option.label,

            position: option.position,
        })),
    })),

    createdAt: productType.createdAt,

    updatedAt: productType.updatedAt,
});

export const getProductTypes = async (): Promise<ProductTypeListResponse> => {
    const productTypes = await prisma.productType.findMany({
        include: productTypeInclude,

        orderBy: {
            name: 'asc',
        },
    });

    return {
        items: productTypes.map(mapProductType),
    };
};

export const getProductTypeBySlug = async (
    slug: string,
): Promise<ProductTypeResponse> => {
    const productType = await prisma.productType.findUnique({
        where: {
            slug,
        },

        include: productTypeInclude,
    });

    if (!productType) {
        throw new AppError(
            404,
            'PRODUCT_TYPE_NOT_FOUND',
            'Product type not found',
        );
    }

    return mapProductType(productType);
};

export const getProductTypeById = async (
    id: string,
): Promise<ProductTypeResponse> => {
    const productType = await prisma.productType.findUnique({
        where: {
            id,
        },

        include: productTypeInclude,
    });

    if (!productType) {
        throw new AppError(
            404,
            'PRODUCT_TYPE_NOT_FOUND',
            'Product type not found',
        );
    }

    return mapProductType(productType);
};

export const createProductType = async (
    input: CreateProductTypeInput,
): Promise<ProductTypeResponse> => {
    const existingProductType = await prisma.productType.findFirst({
        where: {
            OR: [
                {
                    name: {
                        equals: input.name,
                        mode: 'insensitive',
                    },
                },

                {
                    slug: input.slug,
                },
            ],
        },

        select: {
            id: true,
        },
    });

    if (existingProductType) {
        throw new AppError(
            409,
            'PRODUCT_TYPE_ALREADY_EXISTS',
            'Product type with this name or slug already exists',
        );
    }

    const productType = await prisma.productType.create({
        data: {
            name: input.name,

            slug: input.slug,

            description: input.description,
        },

        include: productTypeInclude,
    });

    return mapProductType(productType);
};

export const updateProductType = async (
    id: string,
    input: UpdateProductTypeInput,
): Promise<ProductTypeResponse> => {
    const existingProductType = await prisma.productType.findUnique({
        where: {
            id,
        },

        select: {
            id: true,
        },
    });

    if (!existingProductType) {
        throw new AppError(
            404,
            'PRODUCT_TYPE_NOT_FOUND',
            'Product type not found',
        );
    }

    if (input.name !== undefined || input.slug !== undefined) {
        const duplicateProductType = await prisma.productType.findFirst({
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

        if (duplicateProductType) {
            throw new AppError(
                409,
                'PRODUCT_TYPE_ALREADY_EXISTS',
                'Product type with this name or slug already exists',
            );
        }
    }

    const data: Prisma.ProductTypeUpdateInput = {};

    if (input.name !== undefined) {
        data.name = input.name;
    }

    if (input.slug !== undefined) {
        data.slug = input.slug;
    }

    if (input.description !== undefined) {
        data.description = input.description;
    }

    if (Object.keys(data).length > 0) {
        await prisma.productType.update({
            where: {
                id,
            },

            data,
        });
    }

    const productType = await prisma.productType.findUnique({
        where: {
            id,
        },

        include: productTypeInclude,
    });

    if (!productType) {
        throw new AppError(
            404,
            'PRODUCT_TYPE_NOT_FOUND',
            'Product type not found',
        );
    }

    return mapProductType(productType);
};

export const deleteProductType = async (id: string): Promise<void> => {
    const productType = await prisma.productType.findUnique({
        where: {
            id,
        },

        include: {
            products: {
                select: {
                    id: true,
                },

                take: 1,
            },
        },
    });

    if (!productType) {
        throw new AppError(
            404,
            'PRODUCT_TYPE_NOT_FOUND',
            'Product type not found',
        );
    }

    if (productType.products.length > 0) {
        throw new AppError(
            409,
            'PRODUCT_TYPE_HAS_PRODUCTS',
            'Cannot delete a product type that is assigned to products',
        );
    }

    await prisma.productType.delete({
        where: {
            id,
        },
    });
};
