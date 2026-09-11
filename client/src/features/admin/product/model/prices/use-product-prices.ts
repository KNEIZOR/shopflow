import { useQuery } from '@tanstack/react-query';

import { getProductPrices } from '@/entities/product';

import { adminProductQueryKeys } from '../admin-product-query-keys';

export const productPriceQueryKeys = {
    all: (productId: string) =>
        [...adminProductQueryKeys.all, 'prices', productId] as const,

    list: (productId: string) =>
        [...productPriceQueryKeys.all(productId), 'list'] as const,
};

export const useProductPrices = (productId: string | undefined) => {
    return useQuery({
        queryKey: productId
            ? productPriceQueryKeys.list(productId)
            : [...adminProductQueryKeys.all, 'prices', 'missing'],

        queryFn: () => {
            if (!productId) {
                throw new Error('Product ID is required');
            }

            return getProductPrices(productId);
        },

        enabled: Boolean(productId),
    });
};
