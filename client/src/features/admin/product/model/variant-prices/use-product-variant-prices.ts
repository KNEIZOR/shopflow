import { useQuery } from '@tanstack/react-query';

import { getProductVariantPrices } from '@/entities/product';

import { adminProductQueryKeys } from '../admin-product-query-keys';

export const productVariantPriceQueryKeys = {
    all: (productId: string, variantId: string) =>
        [
            ...adminProductQueryKeys.all,
            'variant-prices',
            productId,
            variantId,
        ] as const,

    list: (productId: string, variantId: string) =>
        [
            ...productVariantPriceQueryKeys.all(productId, variantId),
            'list',
        ] as const,
};

export const useProductVariantPrices = (
    productId: string | undefined,
    variantId: string | undefined,
) => {
    return useQuery({
        queryKey:
            productId && variantId
                ? productVariantPriceQueryKeys.list(productId, variantId)
                : [...adminProductQueryKeys.all, 'variant-prices', 'missing'],

        queryFn: () => {
            if (!productId) {
                throw new Error('Product ID is required');
            }

            if (!variantId) {
                throw new Error('Variant ID is required');
            }

            return getProductVariantPrices(productId, variantId);
        },

        enabled: Boolean(productId) && Boolean(variantId),
    });
};
