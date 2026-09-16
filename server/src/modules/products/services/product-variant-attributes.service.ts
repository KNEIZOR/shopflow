import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import type {
    CreateProductVariantAttributeValueInput,
    UpdateProductVariantAttributeValueInput,
} from '../product-variant-attributes.schema';

import { mapProductVariantAttributeValue } from './product-variant-attribute-mapper.service';

import {
    ensureVariantAttributeAvailable,
    ensureProductVariantAvailable,
} from './product-variant-attribute-validation.service';

import { validateAndNormalizeAttributeValue } from './product-attribute-validation.service';

const attributeValueInclude = {
    attribute: true,

    variant: {
        select: {
            id: true,
            productId: true,
        },
    },
};

export const getProductVariantAttributes = async (
    productId: string,
    variantId: string,
) => {
    const { product, variant } = await ensureProductVariantAvailable(
        productId,
        variantId,
    );

    const values = await prisma.productAttributeValue.findMany({
        where: {
            variantId: variant.id,

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
                    in: ['VARIANT', 'BOTH'],
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
        mapProductVariantAttributeValue({
            ...value,

            productId: product.id,

            variantId: variant.id,

            variantAttribute: relationMap.get(value.attributeId),
        }),
    );
};

export const createProductVariantAttribute = async (
    productId: string,
    variantId: string,
    input: CreateProductVariantAttributeValueInput,
) => {
    const { product, variant, relation } =
        await ensureVariantAttributeAvailable(
            productId,
            variantId,
            input.attributeId,
        );

    const existingValue = await prisma.productAttributeValue.findFirst({
        where: {
            variantId: variant.id,

            attributeId: input.attributeId,
        },

        select: {
            id: true,
        },
    });

    if (existingValue) {
        throw new AppError(
            409,
            'VARIANT_ATTRIBUTE_ALREADY_EXISTS',
            'This variant already has a value for this attribute',
        );
    }

    const normalizedValue = await validateAndNormalizeAttributeValue(
        relation.id,
        relation.attribute.type,
        input.value,
    );

    const value = await prisma.productAttributeValue.create({
        data: {
            variantId: variant.id,

            attributeId: input.attributeId,

            value: normalizedValue,
        },

        include: attributeValueInclude,
    });

    return mapProductVariantAttributeValue({
        ...value,

        productId: product.id,

        variantId: variant.id,

        variantAttribute: {
            id: relation.id,

            isRequired: relation.isRequired,

            position: relation.position,
        },
    });
};

export const updateProductVariantAttribute = async (
    productId: string,
    variantId: string,
    attributeId: string,
    input: UpdateProductVariantAttributeValueInput,
) => {
    const { product, variant, relation } =
        await ensureVariantAttributeAvailable(
            productId,
            variantId,
            attributeId,
        );

    const existingValue = await prisma.productAttributeValue.findFirst({
        where: {
            variantId: variant.id,

            attributeId,
        },

        select: {
            id: true,
        },
    });

    if (!existingValue) {
        throw new AppError(
            404,
            'VARIANT_ATTRIBUTE_VALUE_NOT_FOUND',
            'Variant attribute value not found',
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

    return mapProductVariantAttributeValue({
        ...value,

        productId: product.id,

        variantId: variant.id,

        variantAttribute: {
            id: relation.id,

            isRequired: relation.isRequired,

            position: relation.position,
        },
    });
};

export const deleteProductVariantAttribute = async (
    productId: string,
    variantId: string,
    attributeId: string,
): Promise<void> => {
    const { variant } = await ensureVariantAttributeAvailable(
        productId,
        variantId,
        attributeId,
    );

    const existingValue = await prisma.productAttributeValue.findFirst({
        where: {
            variantId: variant.id,

            attributeId,
        },

        select: {
            id: true,
        },
    });

    if (!existingValue) {
        throw new AppError(
            404,
            'VARIANT_ATTRIBUTE_VALUE_NOT_FOUND',
            'Variant attribute value not found',
        );
    }

    await prisma.productAttributeValue.delete({
        where: {
            id: existingValue.id,
        },
    });
};
