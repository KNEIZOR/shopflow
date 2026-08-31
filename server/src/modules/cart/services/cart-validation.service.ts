import { ProductStatus } from '@prisma/client';

import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

export const validateProductVariant = async ({
    productId,
    variantId,
    quantity,
}: {
    productId: string;
    variantId: string;
    quantity: number;
}) => {
    const variant = await prisma.productVariant.findUnique({
        where: {
            id: variantId,
        },
        select: {
            id: true,
            productId: true,
            price: true,
            stock: true,
            product: {
                select: {
                    id: true,
                    status: true,
                },
            },
        },
    });

    if (!variant) {
        throw new AppError(
            404,
            'PRODUCT_VARIANT_NOT_FOUND',
            'Product variant not found',
        );
    }

    if (variant.productId !== productId) {
        throw new AppError(
            400,
            'VARIANT_PRODUCT_MISMATCH',
            'Product variant does not belong to the specified product',
        );
    }

    if (variant.product.status !== ProductStatus.ACTIVE) {
        throw new AppError(
            400,
            'PRODUCT_NOT_AVAILABLE',
            'Product is not available',
        );
    }

    if (variant.stock < quantity) {
        throw new AppError(
            400,
            'INSUFFICIENT_STOCK',
            'Not enough product stock',
        );
    }

    return variant;
};
