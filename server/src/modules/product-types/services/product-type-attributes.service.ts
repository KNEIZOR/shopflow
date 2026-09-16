import { ProductAttributeScope, ProductAttributeType } from '@prisma/client';

import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

export type CreateProductTypeAttributeInput = {
    name: string;
    slug: string;
    description?: string;
    type: ProductAttributeType;
    scope?: ProductAttributeScope;
    isRequired?: boolean;
    position?: number;
};

export type UpdateProductTypeAttributeInput = {
    name?: string;
    slug?: string;
    description?: string;
    type?: ProductAttributeType;
    scope?: ProductAttributeScope;
    isRequired?: boolean;
    position?: number;
};

const attributeInclude = {
    attribute: true,

    options: {
        orderBy: {
            position: 'asc' as const,
        },
    },
};

const ensureProductTypeExists = async (
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

const ensureAttributeSlugAvailable = async (
    slug: string,
    excludeAttributeId?: string,
): Promise<void> => {
    const attribute = await prisma.productAttribute.findFirst({
        where: {
            slug,

            ...(excludeAttributeId
                ? {
                      id: {
                          not: excludeAttributeId,
                      },
                  }
                : {}),
        },

        select: {
            id: true,
        },
    });

    if (attribute) {
        throw new AppError(
            409,
            'PRODUCT_ATTRIBUTE_ALREADY_EXISTS',
            'Product attribute with this slug already exists',
        );
    }
};

const getAttributeBySlug = async (slug: string) => {
    return prisma.productAttribute.findUnique({
        where: {
            slug,
        },

        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            type: true,
            scope: true,
        },
    });
};

export const createProductTypeAttribute = async (
    productTypeId: string,
    input: CreateProductTypeAttributeInput,
) => {
    await ensureProductTypeExists(productTypeId);

    const existingRelation = await prisma.productTypeAttribute.findFirst({
        where: {
            productTypeId,

            attribute: {
                slug: input.slug,
            },
        },

        select: {
            id: true,
        },
    });

    if (existingRelation) {
        throw new AppError(
            409,
            'PRODUCT_TYPE_ATTRIBUTE_ALREADY_EXISTS',
            'This attribute is already assigned to the product type',
        );
    }

    const existingAttribute = await getAttributeBySlug(input.slug);

    const productTypeAttribute = await prisma.$transaction(async (tx) => {
        let attributeId: string;

        if (existingAttribute) {
            if (
                existingAttribute.type !== input.type ||
                (input.scope !== undefined &&
                    existingAttribute.scope !== input.scope)
            ) {
                throw new AppError(
                    409,
                    'PRODUCT_ATTRIBUTE_CONFLICT',
                    'An attribute with this slug already exists with different type or scope',
                );
            }

            attributeId = existingAttribute.id;
        } else {
            const attribute = await tx.productAttribute.create({
                data: {
                    name: input.name,
                    slug: input.slug,
                    description: input.description,
                    type: input.type,
                    scope: input.scope ?? ProductAttributeScope.PRODUCT,
                },
            });

            attributeId = attribute.id;
        }

        return tx.productTypeAttribute.create({
            data: {
                productTypeId,
                attributeId,
                isRequired: input.isRequired ?? false,
                position: input.position ?? 0,
            },

            include: attributeInclude,
        });
    });

    return productTypeAttribute;
};

export const getProductTypeAttributes = async (productTypeId: string) => {
    await ensureProductTypeExists(productTypeId);

    return prisma.productTypeAttribute.findMany({
        where: {
            productTypeId,
        },

        include: attributeInclude,

        orderBy: {
            position: 'asc',
        },
    });
};

export const getProductTypeAttributeById = async (
    productTypeId: string,
    productTypeAttributeId: string,
) => {
    const productTypeAttribute = await prisma.productTypeAttribute.findFirst({
        where: {
            id: productTypeAttributeId,
            productTypeId,
        },

        include: attributeInclude,
    });

    if (!productTypeAttribute) {
        throw new AppError(
            404,
            'PRODUCT_TYPE_ATTRIBUTE_NOT_FOUND',
            'Product type attribute not found',
        );
    }

    return productTypeAttribute;
};

export const updateProductTypeAttribute = async (
    productTypeId: string,
    productTypeAttributeId: string,
    input: UpdateProductTypeAttributeInput,
) => {
    const existingProductTypeAttribute = await getProductTypeAttributeById(
        productTypeId,
        productTypeAttributeId,
    );

    if (input.slug !== undefined) {
        await ensureAttributeSlugAvailable(
            input.slug,
            existingProductTypeAttribute.attributeId,
        );
    }

    if (input.type !== undefined) {
        const hasValues = await prisma.productAttributeValue.findFirst({
            where: {
                attributeId: existingProductTypeAttribute.attributeId,
            },

            select: {
                id: true,
            },
        });

        if (
            hasValues &&
            input.type !== existingProductTypeAttribute.attribute.type
        ) {
            throw new AppError(
                409,
                'PRODUCT_ATTRIBUTE_IN_USE',
                'Cannot change the attribute type because it is already used by products or variants',
            );
        }
    }

    await prisma.$transaction(async (tx) => {
        const attributeData = {
            ...(input.name !== undefined
                ? {
                      name: input.name,
                  }
                : {}),

            ...(input.slug !== undefined
                ? {
                      slug: input.slug,
                  }
                : {}),

            ...(input.description !== undefined
                ? {
                      description: input.description,
                  }
                : {}),

            ...(input.type !== undefined
                ? {
                      type: input.type,
                  }
                : {}),

            ...(input.scope !== undefined
                ? {
                      scope: input.scope,
                  }
                : {}),
        };

        if (Object.keys(attributeData).length > 0) {
            await tx.productAttribute.update({
                where: {
                    id: existingProductTypeAttribute.attributeId,
                },

                data: attributeData,
            });
        }

        const relationData = {
            ...(input.isRequired !== undefined
                ? {
                      isRequired: input.isRequired,
                  }
                : {}),

            ...(input.position !== undefined
                ? {
                      position: input.position,
                  }
                : {}),
        };

        if (Object.keys(relationData).length > 0) {
            await tx.productTypeAttribute.update({
                where: {
                    id: productTypeAttributeId,
                },

                data: relationData,
            });
        }
    });

    return getProductTypeAttributeById(productTypeId, productTypeAttributeId);
};

export const deleteProductTypeAttribute = async (
    productTypeId: string,
    productTypeAttributeId: string,
): Promise<void> => {
    const productTypeAttribute = await getProductTypeAttributeById(
        productTypeId,
        productTypeAttributeId,
    );

    const attributeUsage = await prisma.productAttributeValue.findFirst({
        where: {
            attributeId: productTypeAttribute.attributeId,
        },

        select: {
            id: true,
        },
    });

    if (attributeUsage) {
        throw new AppError(
            409,
            'PRODUCT_ATTRIBUTE_IN_USE',
            'Cannot delete an attribute that is already used by products or variants',
        );
    }

    await prisma.$transaction(async (tx) => {
        await tx.productTypeAttribute.delete({
            where: {
                id: productTypeAttribute.id,
            },
        });

        const remainingRelations = await tx.productTypeAttribute.count({
            where: {
                attributeId: productTypeAttribute.attributeId,
            },
        });

        if (remainingRelations === 0) {
            await tx.productAttribute.delete({
                where: {
                    id: productTypeAttribute.attributeId,
                },
            });
        }
    });
};
