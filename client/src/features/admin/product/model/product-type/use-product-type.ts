import { useQuery } from '@tanstack/react-query';

import { getProductTypeById } from '@/entities/product-type';

import { productTypeQueryKeys } from './product-type-query-keys';

export const useProductType = (productTypeId: string | undefined) => {
    return useQuery({
        queryKey: productTypeId
            ? productTypeQueryKeys.detail(productTypeId)
            : (['product-types', 'detail', 'disabled'] as const),

        queryFn: () => {
            if (!productTypeId) {
                throw new Error('Product type ID is required');
            }

            return getProductTypeById(productTypeId);
        },

        enabled: Boolean(productTypeId),

        staleTime: 5 * 60 * 1000,
    });
};
