import { ProductAttributeScope } from '@prisma/client';

import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

export const ensureProductVariantAvailable = async (
    productId: string,
    variantId: string,
) => {
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
            'Product type is required to manage variant attributes',
        );
    }

    const productWithType = {
        id: product.id,
        productTypeId: product.productTypeId,
    };

    const variant = await prisma.productVariant.findFirst({
        where: {
            id: variantId,
            productId,
        },

        select: {
            id: true,
            productId: true,
        },
    });

    if (!variant) {
        throw new AppError(
            404,
            'PRODUCT_VARIANT_NOT_FOUND',
            'Product variant not found',
        );
    }

    return {
        product: productWithType,
        variant,
    };
};

export const ensureVariantAttributeAvailable = async (
    productId: string,
    variantId: string,
    attributeId: string,
) => {
    const { product, variant } = await ensureProductVariantAvailable(
        productId,
        variantId,
    );

    const relation = await prisma.productTypeAttribute.findFirst({
        where: {
            productTypeId: product.productTypeId,

            attributeId,

            attribute: {
                scope: {
                    in: [
                        ProductAttributeScope.VARIANT,
                        ProductAttributeScope.BOTH,
                    ],
                },
            },
        },

        include: {
            attribute: true,
        },
    });

    if (!relation) {
        throw new AppError(
            400,
            'ATTRIBUTE_NOT_AVAILABLE',
            'This attribute is not available for the product variant',
        );
    }

    return {
        product,
        variant,
        relation,
    };
};
