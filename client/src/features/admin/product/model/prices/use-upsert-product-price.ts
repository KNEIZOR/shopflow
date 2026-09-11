import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    upsertProductPrice,
    type UpsertProductPriceInput,
} from '@/entities/product';

import type { CurrencyCode } from '@/shared/config/currencies';

import { adminProductQueryKeys } from '../admin-product-query-keys';

import { productPriceQueryKeys } from './use-product-prices';

type UpsertProductPriceVariables = {
    productId: string;
    currency: CurrencyCode;
    input: UpsertProductPriceInput;
};

export const useUpsertProductPrice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            currency,
            input,
        }: UpsertProductPriceVariables) =>
            upsertProductPrice(productId, currency, input),

        onSuccess: async (_price, variables) => {
            await queryClient.invalidateQueries({
                queryKey: productPriceQueryKeys.list(variables.productId),
            });

            await queryClient.invalidateQueries({
                queryKey: adminProductQueryKeys.details(),
            });
        },
    });
};
