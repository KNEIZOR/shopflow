import { useQuery } from '@tanstack/react-query';

import {
    getProductVariantAttributes,
    type ProductVariantAttributesResponse,
} from '@/entities/product';

import { productVariantAttributeQueryKeys } from './product-variant-attribute-query-keys';

export const useProductVariantAttributes = (
    productId: string | undefined,
    variantId: string | undefined,
    enabled = true,
) => {
    return useQuery<ProductVariantAttributesResponse>({
        queryKey:
            productId && variantId
                ? productVariantAttributeQueryKeys.list(productId, variantId)
                : (['product-variant-attributes', 'missing'] as const),

        queryFn: () => {
            if (!productId) {
                throw new Error('Product ID is required');
            }

            if (!variantId) {
                throw new Error('Variant ID is required');
            }

            return getProductVariantAttributes(productId, variantId);
        },

        enabled: enabled && Boolean(productId) && Boolean(variantId),
    });
};
