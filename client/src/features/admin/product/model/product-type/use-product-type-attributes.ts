import { useQuery } from '@tanstack/react-query';

import { getProductTypeAttributes } from '@/entities/product-type';

import { productTypeQueryKeys } from './product-type-query-keys';

export const useProductTypeAttributes = (productTypeId: string | undefined) => {
    return useQuery({
        queryKey: productTypeId
            ? productTypeQueryKeys.attributes(productTypeId)
            : (['product-types', 'attributes', 'disabled'] as const),

        queryFn: () => {
            if (!productTypeId) {
                throw new Error('Product type ID is required');
            }

            return getProductTypeAttributes(productTypeId);
        },

        enabled: Boolean(productTypeId),

        staleTime: 5 * 60 * 1000,
    });
};
