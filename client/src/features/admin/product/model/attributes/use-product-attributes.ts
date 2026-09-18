import { useQuery } from '@tanstack/react-query';

import { getProductAttributes } from '@/entities/product';

import { adminProductQueryKeys } from '../admin-product-query-keys';

export const useProductAttributes = (
    productId: string | undefined,
    enabled = true,
) => {
    return useQuery({
        queryKey: productId
            ? adminProductQueryKeys.attributeList(productId)
            : [...adminProductQueryKeys.all, 'attributes', 'missing'],

        queryFn: () => {
            if (!productId) {
                throw new Error('Product ID is required');
            }

            return getProductAttributes(productId);
        },

        enabled: enabled && Boolean(productId),
    });
};
