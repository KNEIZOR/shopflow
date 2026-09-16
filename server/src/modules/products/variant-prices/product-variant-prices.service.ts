import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import type { UpsertProductVariantPriceInput } from './product-variant-prices.schema';

import type {
    ProductVariantPriceResponse,
    ProductVariantPricesResponse,
} from './product-variant-prices.types';

const DEFAULT_CURRENCY = 'RUB';

type ProductVariantPriceRecord = {
    id: string;
    variantId: string;
    currency: 'RUB' | 'EUR' | 'USD' | 'AMD';
    amount: unknown;
    createdAt: Date;
    updatedAt: Date;
};

const mapPrice = (
    price: ProductVariantPriceRecord,
): ProductVariantPriceResponse => {
    return {
        id: price.id,
        variantId: price.variantId,
        currency: price.currency,
        amount: String(price.amount),
        createdAt: price.createdAt,
        updatedAt: price.updatedAt,
    };
};

const ensureVariantExists = async (
    productId: string,
    variantId: string,
): Promise<void> => {
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
};

export const getProductVariantPrices = async (
    productId: string,
    variantId: string,
): Promise<ProductVariantPricesResponse> => {
    await ensureVariantExists(productId, variantId);

    const prices = await prisma.productVariantPrice.findMany({
        where: {
            variantId,
        },
        orderBy: {
            currency: 'asc',
        },
    });

    return {
        items: prices.map(mapPrice),
    };
};

export const getProductVariantPrice = async (
    productId: string,
    variantId: string,
    currency: ProductVariantPriceRecord['currency'],
): Promise<ProductVariantPriceResponse> => {
    await ensureVariantExists(productId, variantId);

    const price = await prisma.productVariantPrice.findUnique({
        where: {
            variantId_currency: {
                variantId,
                currency,
            },
        },
    });

    if (!price) {
        throw new AppError(
            404,
            'PRODUCT_VARIANT_PRICE_NOT_FOUND',
            'Product variant price not found',
        );
    }

    return mapPrice(price);
};

export const upsertProductVariantPrice = async (
    productId: string,
    variantId: string,
    currency: ProductVariantPriceRecord['currency'],
    input: UpsertProductVariantPriceInput,
): Promise<ProductVariantPriceResponse> => {
    await ensureVariantExists(productId, variantId);

    const price = await prisma.productVariantPrice.upsert({
        where: {
            variantId_currency: {
                variantId,
                currency,
            },
        },

        create: {
            variantId,
            currency,
            amount: input.amount,
        },

        update: {
            amount: input.amount,
        },
    });

    return mapPrice(price);
};

export const deleteProductVariantPrice = async (
    productId: string,
    variantId: string,
    currency: ProductVariantPriceRecord['currency'],
): Promise<void> => {
    await ensureVariantExists(productId, variantId);

    if (currency === DEFAULT_CURRENCY) {
        throw new AppError(
            400,
            'DEFAULT_CURRENCY_REQUIRED',
            'The default variant price cannot be deleted',
        );
    }

    const price = await prisma.productVariantPrice.findUnique({
        where: {
            variantId_currency: {
                variantId,
                currency,
            },
        },
        select: {
            id: true,
        },
    });

    if (!price) {
        throw new AppError(
            404,
            'PRODUCT_VARIANT_PRICE_NOT_FOUND',
            'Product variant price not found',
        );
    }

    await prisma.productVariantPrice.delete({
        where: {
            id: price.id,
        },
    });
};
