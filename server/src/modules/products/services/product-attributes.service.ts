import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import type {
    CreateProductAttributeValueInput,
    UpdateProductAttributeValueInput,
} from '../product-attributes.schema';

import { mapProductAttributeValue } from './product-attribute-mapper.service';

import {
    ensureProductAttributeAvailable,
    validateAndNormalizeAttributeValue,
} from './product-attribute-validation.service';

const attributeValueInclude = {
    attribute: true,

    product: {
        select: {
            id: true,
        },
    },
};

export const getProductAttributes = async (productId: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },

        select: {
            id: true,
            productTypeId: true,
        },
    });

    if (!product) {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }

    if (!product.productTypeId) {
        return [];
    }

    const values = await prisma.productAttributeValue.findMany({
        where: {
            productId,

            attribute: {
                productTypes: {
                    some: {
                        productTypeId: product.productTypeId,
                    },
                },
            },
        },

        include: {
            attribute: true,
        },

        orderBy: {
            attribute: {
                name: 'asc',
            },
        },
    });

    const relations = await prisma.productTypeAttribute.findMany({
        where: {
            productTypeId: product.productTypeId,

            attribute: {
                scope: {
                    in: ['PRODUCT', 'BOTH'],
                },
            },
        },

        select: {
            id: true,
            attributeId: true,
            isRequired: true,
            position: true,
        },
    });

    const relationMap = new Map(
        relations.map((relation) => [relation.attributeId, relation]),
    );

    return values.map((value) =>
        mapProductAttributeValue({
            ...value,

            productId,

            variantId: null,

            productAttribute: relationMap.get(value.attributeId),
        }),
    );
};

export const createProductAttribute = async (
    productId: string,
    input: CreateProductAttributeValueInput,
) => {
    const { relation } = await ensureProductAttributeAvailable(
        productId,
        input.attributeId,
    );

    const existingValue = await prisma.productAttributeValue.findFirst({
        where: {
            productId,

            attributeId: input.attributeId,
        },

        select: {
            id: true,
        },
    });

    if (existingValue) {
        throw new AppError(
            409,
            'PRODUCT_ATTRIBUTE_ALREADY_EXISTS',
            'This product already has a value for this attribute',
        );
    }

    const normalizedValue = await validateAndNormalizeAttributeValue(
        relation.id,
        relation.attribute.type,
        input.value,
    );

    const value = await prisma.productAttributeValue.create({
        data: {
            productId,

            attributeId: input.attributeId,

            value: normalizedValue,
        },

        include: attributeValueInclude,
    });

    return mapProductAttributeValue({
        ...value,

        productId,

        variantId: null,

        productAttribute: {
            id: relation.id,

            isRequired: relation.isRequired,

            position: relation.position,
        },
    });
};

export const updateProductAttribute = async (
    productId: string,
    attributeId: string,
    input: UpdateProductAttributeValueInput,
) => {
    const { relation } = await ensureProductAttributeAvailable(
        productId,
        attributeId,
    );

    const existingValue = await prisma.productAttributeValue.findFirst({
        where: {
            productId,

            attributeId,
        },

        select: {
            id: true,
        },
    });

    if (!existingValue) {
        throw new AppError(
            404,
            'PRODUCT_ATTRIBUTE_VALUE_NOT_FOUND',
            'Product attribute value not found',
        );
    }

    const normalizedValue = await validateAndNormalizeAttributeValue(
        relation.id,
        relation.attribute.type,
        input.value,
    );

    const value = await prisma.productAttributeValue.update({
        where: {
            id: existingValue.id,
        },

        data: {
            value: normalizedValue,
        },

        include: attributeValueInclude,
    });

    return mapProductAttributeValue({
        ...value,

        productId,

        variantId: null,

        productAttribute: {
            id: relation.id,

            isRequired: relation.isRequired,

            position: relation.position,
        },
    });
};

export const deleteProductAttribute = async (
    productId: string,
    attributeId: string,
): Promise<void> => {
    await ensureProductAttributeAvailable(productId, attributeId);

    const existingValue = await prisma.productAttributeValue.findFirst({
        where: {
            productId,

            attributeId,
        },

        select: {
            id: true,
        },
    });

    if (!existingValue) {
        throw new AppError(
            404,
            'PRODUCT_ATTRIBUTE_VALUE_NOT_FOUND',
            'Product attribute value not found',
        );
    }

    await prisma.productAttributeValue.delete({
        where: {
            id: existingValue.id,
        },
    });
};
