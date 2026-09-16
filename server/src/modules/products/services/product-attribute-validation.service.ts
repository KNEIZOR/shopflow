import { ProductAttributeScope, ProductAttributeType } from '@prisma/client';

import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

const getProductWithType = async (productId: string) => {
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
        throw new AppError(
            409,
            'PRODUCT_TYPE_REQUIRED',
            'Product type is required to manage product attributes',
        );
    }

    return {
        id: product.id,
        productTypeId: product.productTypeId,
    };
};

export const ensureProductAttributeAvailable = async (
    productId: string,
    attributeId: string,
) => {
    const product = await getProductWithType(productId);

    const relation = await prisma.productTypeAttribute.findFirst({
        where: {
            productTypeId: product.productTypeId,

            attributeId,
        },

        include: {
            attribute: true,
        },
    });

    if (!relation) {
        throw new AppError(
            400,
            'ATTRIBUTE_NOT_AVAILABLE',
            'This attribute is not assigned to the product type',
        );
    }

    if (
        relation.attribute.scope !== ProductAttributeScope.PRODUCT &&
        relation.attribute.scope !== ProductAttributeScope.BOTH
    ) {
        throw new AppError(
            400,
            'ATTRIBUTE_NOT_ALLOWED_FOR_PRODUCT',
            'This attribute cannot be assigned directly to a product',
        );
    }

    return {
        product,
        relation,
    };
};

const normalizeAttributeValue = (
    type: ProductAttributeType,
    value: string | number | boolean,
): string => {
    switch (type) {
        case ProductAttributeType.TEXT: {
            if (typeof value !== 'string') {
                throw new AppError(
                    400,
                    'INVALID_ATTRIBUTE_VALUE',
                    'TEXT attribute requires a string value',
                );
            }

            const normalized = value.trim();

            if (!normalized) {
                throw new AppError(
                    400,
                    'INVALID_ATTRIBUTE_VALUE',
                    'Attribute value cannot be empty',
                );
            }

            return normalized;
        }

        case ProductAttributeType.NUMBER: {
            const numericValue =
                typeof value === 'number' ? value : Number(value);

            if (!Number.isFinite(numericValue)) {
                throw new AppError(
                    400,
                    'INVALID_ATTRIBUTE_VALUE',
                    'NUMBER attribute requires a valid number',
                );
            }

            return String(numericValue);
        }

        case ProductAttributeType.BOOLEAN: {
            if (typeof value === 'boolean') {
                return String(value);
            }

            if (value === 'true' || value === 'false') {
                return value;
            }

            throw new AppError(
                400,
                'INVALID_ATTRIBUTE_VALUE',
                'BOOLEAN attribute requires true or false',
            );
        }

        case ProductAttributeType.SELECT: {
            if (typeof value !== 'string') {
                throw new AppError(
                    400,
                    'INVALID_ATTRIBUTE_VALUE',
                    'SELECT attribute requires a string value',
                );
            }

            const normalized = value.trim();

            if (!normalized) {
                throw new AppError(
                    400,
                    'INVALID_ATTRIBUTE_VALUE',
                    'SELECT attribute value cannot be empty',
                );
            }

            return normalized;
        }

        default:
            throw new AppError(
                400,
                'INVALID_ATTRIBUTE_TYPE',
                'Unsupported product attribute type',
            );
    }
};

const ensureSelectOptionExists = async (
    productTypeAttributeId: string,
    value: string,
): Promise<void> => {
    const option = await prisma.productAttributeOption.findFirst({
        where: {
            productTypeAttributeId,

            value,
        },

        select: {
            id: true,
        },
    });

    if (!option) {
        throw new AppError(
            400,
            'INVALID_ATTRIBUTE_OPTION',
            'Selected value is not available for this attribute',
        );
    }
};

export const validateAndNormalizeAttributeValue = async (
    productTypeAttributeId: string,
    type: ProductAttributeType,
    value: string | number | boolean,
): Promise<string> => {
    const normalized = normalizeAttributeValue(type, value);

    if (type === ProductAttributeType.SELECT) {
        await ensureSelectOptionExists(productTypeAttributeId, normalized);
    }

    return normalized;
};
