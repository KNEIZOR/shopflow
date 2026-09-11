import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    upsertProductVariantPrice,
    type UpsertProductVariantPriceInput,
} from '@/entities/product';

import type { CurrencyCode } from '@/shared/config/currencies';

import { adminProductQueryKeys } from '../admin-product-query-keys';

import { productVariantPriceQueryKeys } from './use-product-variant-prices';

type UpsertProductVariantPriceVariables = {
    productId: string;
    variantId: string;
    currency: CurrencyCode;
    input: UpsertProductVariantPriceInput;
};

export const useUpsertProductVariantPrice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            variantId,
            currency,
            input,
        }: UpsertProductVariantPriceVariables) =>
            upsertProductVariantPrice(productId, variantId, currency, input),

        onSuccess: async (_price, variables) => {
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
