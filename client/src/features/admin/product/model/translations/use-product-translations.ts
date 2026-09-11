import { useQuery } from '@tanstack/react-query';

import { getProductTranslations } from '@/entities/product';

import { adminProductQueryKeys } from '../admin-product-query-keys';

export const productTranslationQueryKeys = {
    all: (productId: string) =>
        [...adminProductQueryKeys.all, 'translations', productId] as const,

    list: (productId: string) =>
        [...productTranslationQueryKeys.all(productId), 'list'] as const,
};

export const useProductTranslations = (productId: string | undefined) => {
    return useQuery({
        queryKey: productId
            ? productTranslationQueryKeys.list(productId)
            : [...adminProductQueryKeys.all, 'translations', 'missing'],

        queryFn: () => {
            if (!productId) {
                throw new Error('Product ID is required');
            }

            return getProductTranslations(productId);
        },

        enabled: Boolean(productId),
    });
};
