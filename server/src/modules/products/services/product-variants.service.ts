import { Prisma } from '@prisma/client';

import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

export type CreateProductVariantInput = {
    name: string;
    sku: string;
    price?: number;
    stock?: number;
};

export type UpdateProductVariantInput = {
    name?: string;
    sku?: string;
    price?: number | null;
    stock?: number;
};

const getProduct = async (productId: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
        },
    });

    if (!product) {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }

    return product;
};

export const getProductVariants = async (productId: string) => {
    await getProduct(productId);

    return prisma.productVariant.findMany({
        where: {
            productId,
        },
        orderBy: {
            name: 'asc',
        },
    });
};

export const addProductVariant = async (
    productId: string,
    input: CreateProductVariantInput,
) => {
    await getProduct(productId);

    const existingVariant = await prisma.productVariant.findUnique({
        where: {
            sku: input.sku,
        },
        select: {
            id: true,
        },
    });

    if (existingVariant) {
        throw new AppError(
            409,
            'SKU_ALREADY_EXISTS',
            'Variant with this SKU already exists',
        );
    }

    const variant = await prisma.productVariant.create({
        data: {
            productId,
            name: input.name,
            sku: input.sku,
            price:
                input.price === undefined
                    ? undefined
                    : new Prisma.Decimal(input.price.toFixed(2)),
            stock: input.stock ?? 0,
        },
    });

    return variant;
};

export const updateProductVariant = async (
    productId: string,
    variantId: string,
    input: UpdateProductVariantInput,
) => {
    await getProduct(productId);

    const variant = await prisma.productVariant.findFirst({
        where: {
            id: variantId,
            productId,
        },
        select: {
            id: true,
        },
    });

    if (!variant) {
        throw new AppError(
            404,
            'PRODUCT_VARIANT_NOT_FOUND',
            'Product variant not found',
        );
    }

    if (input.sku !== undefined) {
        const duplicateVariant = await prisma.productVariant.findFirst({
            where: {
                sku: input.sku,
                id: {
                    not: variantId,
                },
            },
            select: {
                id: true,
            },
        });

        if (duplicateVariant) {
            throw new AppError(
                409,
                'SKU_ALREADY_EXISTS',
                'Variant with this SKU already exists',
            );
        }
    }

    const data: Prisma.ProductVariantUpdateInput = {};

    if (input.name !== undefined) {
        data.name = input.name;
    }

    if (input.sku !== undefined) {
        data.sku = input.sku;
    }

    if (input.price !== undefined) {
        data.price =
            input.price === null
                ? null
                : new Prisma.Decimal(input.price.toFixed(2));
    }

    if (input.stock !== undefined) {
        data.stock = input.stock;
    }

    return prisma.productVariant.update({
        where: {
            id: variantId,
        },
        data,
    });
};

export const deleteProductVariant = async (
    productId: string,
    variantId: string,
) => {
    await getProduct(productId);

    const variant = await prisma.productVariant.findFirst({
        where: {
            id: variantId,
            productId,
        },
        select: {
            id: true,
        },
    });

    if (!variant) {
        throw new AppError(
            404,
            'PRODUCT_VARIANT_NOT_FOUND',
            'Product variant not found',
        );
    }

    await prisma.productVariant.delete({
        where: {
            id: variantId,
        },
    });
};
