import { useQuery } from '@tanstack/react-query';

import { getProductTypeOptions } from '@/entities/product-type';

import { productTypeQueryKeys } from './product-type-query-keys';

export const useProductTypeOptions = (
    productTypeId: string | undefined,
    attributeId: string | undefined,
) => {
    const enabled = Boolean(productTypeId && attributeId);

    return useQuery({
        queryKey:
            enabled && productTypeId && attributeId
                ? productTypeQueryKeys.options(productTypeId, attributeId)
                : (['product-types', 'options', 'disabled'] as const),

        queryFn: () => {
            if (!productTypeId || !attributeId) {
                throw new Error(
                    'Product type ID and attribute ID are required',
                );
            }

            return getProductTypeOptions(productTypeId, attributeId);
        },

        enabled,

        staleTime: 5 * 60 * 1000,
    });
};
