import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProductVariantPrice } from '@/entities/product';

import type { CurrencyCode } from '@/shared/config/currencies';

import { adminProductQueryKeys } from '../admin-product-query-keys';

import { productVariantPriceQueryKeys } from './use-product-variant-prices';

type DeleteProductVariantPriceVariables = {
    productId: string;
    variantId: string;
    currency: CurrencyCode;
};

export const useDeleteProductVariantPrice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            variantId,
            currency,
        }: DeleteProductVariantPriceVariables) =>
            deleteProductVariantPrice(productId, variantId, currency),

        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({
                queryKey: productVariantPriceQueryKeys.list(
                    variables.productId,
                    variables.variantId,
                ),
            });

            await queryClient.invalidateQueries({
                queryKey: adminProductQueryKeys.details(),
            });
        },
    });
};
