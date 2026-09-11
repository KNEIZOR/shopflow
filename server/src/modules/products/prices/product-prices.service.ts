import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import type { UpsertProductPriceInput } from './product-prices.schema';

import type {
    ProductPriceResponse,
    ProductPricesResponse,
} from './product-prices.types';

const DEFAULT_CURRENCY = 'RUB';

type ProductPriceRecord = {
    id: string;
    productId: string;
    currency: 'RUB' | 'EUR' | 'USD' | 'GBP';
    amount: unknown;
    createdAt: Date;
    updatedAt: Date;
};

const mapPrice = (price: ProductPriceRecord): ProductPriceResponse => {
    return {
        id: price.id,
        productId: price.productId,
        currency: price.currency,
        amount: String(price.amount),
        createdAt: price.createdAt,
        updatedAt: price.updatedAt,
    };
};

const ensureProductExists = async (productId: string): Promise<void> => {
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
};

export const getProductPrices = async (
    productId: string,
): Promise<ProductPricesResponse> => {
    await ensureProductExists(productId);

    const prices = await prisma.productPrice.findMany({
        where: {
            productId,
        },
        orderBy: {
            currency: 'asc',
        },
    });

    return {
        items: prices.map(mapPrice),
    };
};

export const getProductPrice = async (
    productId: string,
    currency: ProductPriceRecord['currency'],
): Promise<ProductPriceResponse> => {
    await ensureProductExists(productId);

    const price = await prisma.productPrice.findUnique({
        where: {
            productId_currency: {
                productId,
                currency,
            },
        },
    });

    if (!price) {
        throw new AppError(
            404,
            'PRODUCT_PRICE_NOT_FOUND',
            'Product price not found',
        );
    }

    return mapPrice(price);
};

export const upsertProductPrice = async (
    productId: string,
    currency: ProductPriceRecord['currency'],
    input: UpsertProductPriceInput,
): Promise<ProductPriceResponse> => {
    await ensureProductExists(productId);

    const price = await prisma.productPrice.upsert({
        where: {
            productId_currency: {
                productId,
                currency,
            },
        },

        create: {
            productId,
            currency,
            amount: input.amount,
        },

        update: {
            amount: input.amount,
        },
    });

    return mapPrice(price);
};

export const deleteProductPrice = async (
    productId: string,
    currency: ProductPriceRecord['currency'],
): Promise<void> => {
    await ensureProductExists(productId);

    if (currency === DEFAULT_CURRENCY) {
        throw new AppError(
            400,
            'DEFAULT_CURRENCY_REQUIRED',
            'The default product price cannot be deleted',
        );
    }

    const price = await prisma.productPrice.findUnique({
        where: {
            productId_currency: {
                productId,
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
            'PRODUCT_PRICE_NOT_FOUND',
            'Product price not found',
        );
    }

    await prisma.productPrice.delete({
        where: {
            id: price.id,
        },
    });
};
