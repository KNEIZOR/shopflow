import { useQuery } from '@tanstack/react-query';

import { getProductVariants } from '@/entities/product';

import { adminProductQueryKeys } from '../admin-product-query-keys';

export const productVariantQueryKeys = {
    all: (productId: string) =>
        [...adminProductQueryKeys.all, 'variants', productId] as const,

    list: (productId: string) =>
        [...productVariantQueryKeys.all(productId), 'list'] as const,
};

export const useProductVariants = (productId: string | undefined) => {
    return useQuery({
        queryKey: productId
            ? productVariantQueryKeys.list(productId)
            : [...adminProductQueryKeys.all, 'variants', 'missing'],

        queryFn: () => {
            if (!productId) {
                throw new Error('Product ID is required');
            }

            return getProductVariants(productId);
        },

        enabled: Boolean(productId),
    });
};
