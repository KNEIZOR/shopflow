import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    updateProductVariant,
    type UpdateProductVariantInput,
} from '@/entities/product';

import { adminProductQueryKeys } from '../admin-product-query-keys';

import { productVariantQueryKeys } from './use-product-variants';

type UpdateProductVariantVariables = {
    productId: string;
    variantId: string;
    input: UpdateProductVariantInput;
};

export const useUpdateProductVariant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            variantId,
            input,
        }: UpdateProductVariantVariables) =>
            updateProductVariant(productId, variantId, input),

        onSuccess: async (_variant, variables) => {
            await queryClient.invalidateQueries({
                queryKey: productVariantQueryKeys.list(variables.productId),
            });

            await queryClient.invalidateQueries({
                queryKey: adminProductQueryKeys.details(),
            });
        },
    });
};
