import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProductPrice } from '@/entities/product';

import type { CurrencyCode } from '@/shared/config/currencies';

import { adminProductQueryKeys } from '../admin-product-query-keys';

import { productPriceQueryKeys } from './use-product-prices';

type DeleteProductPriceVariables = {
    productId: string;
    currency: CurrencyCode;
};

export const useDeleteProductPrice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, currency }: DeleteProductPriceVariables) =>
            deleteProductPrice(productId, currency),

        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({
                queryKey: productPriceQueryKeys.list(variables.productId),
            });

            await queryClient.invalidateQueries({
                queryKey: adminProductQueryKeys.details(),
            });
        },
    });
};
