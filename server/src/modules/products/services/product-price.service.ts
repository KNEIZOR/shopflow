import type { CurrencyCode } from '@prisma/client';

import type { ProductWithRelations } from './product.include';

const DEFAULT_CURRENCY: CurrencyCode = 'RUB';

type ProductPriceRelation = ProductWithRelations['prices'][number];

type ProductVariantRelation = ProductWithRelations['variants'][number];

export const getPriceForCurrency = (
    prices: ProductPriceRelation[],
    currency: CurrencyCode,
): ProductPriceRelation | null => {
    return prices.find((price) => price.currency === currency) ?? null;
};

export const getFallbackRubPrice = (
    prices: ProductPriceRelation[],
): ProductPriceRelation | null => {
    return prices.find((price) => price.currency === DEFAULT_CURRENCY) ?? null;
};

export const getProductDisplayPrice = (
    product: ProductWithRelations,
    currency: CurrencyCode,
) => {
    const requestedPrice = getPriceForCurrency(product.prices, currency);

    if (requestedPrice) {
        return requestedPrice;
    }

    const rubPrice = getFallbackRubPrice(product.prices);

    if (rubPrice) {
        return rubPrice;
    }

    return {
        amount: product.price,
        currency: DEFAULT_CURRENCY,
    };
};

export const getVariantPriceForCurrency = (
    prices: ProductVariantRelation['prices'],
    currency: CurrencyCode,
) => {
    return prices.find((price) => price.currency === currency) ?? null;
};

export const getVariantFallbackRubPrice = (
    prices: ProductVariantRelation['prices'],
) => {
    return prices.find((price) => price.currency === DEFAULT_CURRENCY) ?? null;
};

export const getVariantDisplayPrice = (
    variant: ProductVariantRelation,
    currency: CurrencyCode,
) => {
    const requestedPrice = getVariantPriceForCurrency(variant.prices, currency);

    if (requestedPrice) {
        return requestedPrice;
    }

    const rubPrice = getVariantFallbackRubPrice(variant.prices);

    if (rubPrice) {
        return rubPrice;
    }

    if (variant.price !== null) {
        return {
            amount: variant.price,
            currency: DEFAULT_CURRENCY,
        };
    }

    return null;
};

export const sortProductsByPrice = (
    products: ProductWithRelations[],
    currency: CurrencyCode,
    direction: 'asc' | 'desc',
) => {
    return [...products].sort((first, second) => {
        const firstPrice = getProductDisplayPrice(first, currency);

        const secondPrice = getProductDisplayPrice(second, currency);

        const comparison = firstPrice.amount.comparedTo(secondPrice.amount);

        return direction === 'asc' ? comparison : -comparison;
    });
};
