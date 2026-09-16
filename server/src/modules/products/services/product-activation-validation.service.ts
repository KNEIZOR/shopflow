import { ProductAttributeScope } from '@prisma/client';

import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

type RequiredAttributeRelation = {
    id: string;
    attributeId: string;
    isRequired: boolean;
    position: number;

    attribute: {
        id: string;
        name: string;
        slug: string;
        scope: ProductAttributeScope;
    };
};

const getProduct = async (productId: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },

        select: {
            id: true,
            name: true,
            productTypeId: true,
        },
    });

    if (!product) {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }

    return product;
};

const getRequiredProductAttributes = async (
    productTypeId: string,
): Promise<RequiredAttributeRelation[]> => {
    return prisma.productTypeAttribute.findMany({
        where: {
            productTypeId,

            isRequired: true,

            attribute: {
                scope: {
                    in: [
                        ProductAttributeScope.PRODUCT,
                        ProductAttributeScope.BOTH,
                    ],
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
                    scope: true,
                },
            },
        },

        orderBy: [
            {
                position: 'asc',
            },
            {
                attribute: {
                    name: 'asc',
                },
            },
        ],
    });
};

const getRequiredVariantAttributes = async (
    productTypeId: string,
): Promise<RequiredAttributeRelation[]> => {
    return prisma.productTypeAttribute.findMany({
        where: {
            productTypeId,

            isRequired: true,

            attribute: {
                scope: {
                    in: [
                        ProductAttributeScope.VARIANT,
                        ProductAttributeScope.BOTH,
                    ],
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
                    scope: true,
                },
            },
        },

        orderBy: [
            {
                position: 'asc',
            },
            {
                attribute: {
                    name: 'asc',
                },
            },
        ],
    });
};

const validateRequiredProductAttributes = async (
    productId: string,
    requiredAttributes: RequiredAttributeRelation[],
): Promise<void> => {
    if (requiredAttributes.length === 0) {
        return;
    }

    const values = await prisma.productAttributeValue.findMany({
        where: {
            productId,

            attributeId: {
                in: requiredAttributes.map((relation) => relation.attributeId),
            },
        },

        select: {
            attributeId: true,
            value: true,
        },
    });

    const valueMap = new Map(
        values.map((value) => [value.attributeId, value.value]),
    );

    const missingAttributes = requiredAttributes.filter((relation) => {
        const value = valueMap.get(relation.attributeId);

        return value === undefined || value.trim() === '';
    });

    if (missingAttributes.length === 0) {
        return;
    }

    const attributeNames = missingAttributes
        .map((relation) => relation.attribute.name)
        .join(', ');

    throw new AppError(
        422,
        'REQUIRED_PRODUCT_ATTRIBUTES_MISSING',
        `Required product attributes are missing: ${attributeNames}`,
    );
};

const validateRequiredVariantAttributes = async (
    productId: string,
    requiredAttributes: RequiredAttributeRelation[],
): Promise<void> => {
    if (requiredAttributes.length === 0) {
        return;
    }

    const variants = await prisma.productVariant.findMany({
        where: {
            productId,
        },

        select: {
            id: true,
            name: true,
        },

        orderBy: {
            createdAt: 'asc',
        },
    });

    if (variants.length === 0) {
        throw new AppError(
            422,
            'REQUIRED_VARIANT_ATTRIBUTES_MISSING',
            'Product must have at least one variant with all required variant attributes',
        );
    }

    const values = await prisma.productAttributeValue.findMany({
        where: {
            variantId: {
                in: variants.map((variant) => variant.id),
            },

            attributeId: {
                in: requiredAttributes.map((relation) => relation.attributeId),
            },
        },

        select: {
            variantId: true,
            attributeId: true,
            value: true,
        },
    });

    const valueMap = new Map<string, string>();

    for (const value of values) {
        if (!value.variantId) {
            continue;
        }

        valueMap.set(`${value.variantId}:${value.attributeId}`, value.value);
    }

    const invalidVariants: Array<{
        variantName: string;
        missingAttributes: string[];
    }> = [];

    for (const variant of variants) {
        const missingAttributes = requiredAttributes
            .filter((relation) => {
                const value = valueMap.get(
                    `${variant.id}:${relation.attributeId}`,
                );

                return value === undefined || value.trim() === '';
            })
            .map((relation) => relation.attribute.name);

        if (missingAttributes.length > 0) {
            invalidVariants.push({
                variantName: variant.name,

                missingAttributes,
            });
        }
    }

    if (invalidVariants.length === 0) {
        return;
    }

    const details = invalidVariants
        .map(
            (variant) =>
                `${variant.variantName}: ${variant.missingAttributes.join(', ')}`,
        )
        .join('; ');

    throw new AppError(
        422,
        'REQUIRED_VARIANT_ATTRIBUTES_MISSING',
        `Required variant attributes are missing: ${details}`,
    );
};

export const validateProductCanBeActivated = async (
    productId: string,
    productTypeId?: string | null,
): Promise<void> => {
    const product = await getProduct(productId);

    const targetProductTypeId =
        productTypeId !== undefined ? productTypeId : product.productTypeId;

    if (!targetProductTypeId) {
        return;
    }

    const [requiredProductAttributes, requiredVariantAttributes] =
        await Promise.all([
            getRequiredProductAttributes(targetProductTypeId),

            getRequiredVariantAttributes(targetProductTypeId),
        ]);

    await validateRequiredProductAttributes(
        product.id,
        requiredProductAttributes,
    );

    await validateRequiredVariantAttributes(
        product.id,
        requiredVariantAttributes,
    );
};
