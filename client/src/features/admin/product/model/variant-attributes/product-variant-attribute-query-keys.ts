import { adminProductQueryKeys } from '../admin-product-query-keys';

export const productVariantAttributeQueryKeys = {
    all: (productId: string, variantId: string) =>
        [
            ...adminProductQueryKeys.all,
            'variant-attributes',
            productId,
            variantId,
        ] as const,

    list: (productId: string, variantId: string) =>
        [
            ...productVariantAttributeQueryKeys.all(productId, variantId),
            'list',
        ] as const,

    detail: (productId: string, variantId: string, attributeId: string) =>
        [
            ...productVariantAttributeQueryKeys.list(productId, variantId),
            attributeId,
        ] as const,
};
