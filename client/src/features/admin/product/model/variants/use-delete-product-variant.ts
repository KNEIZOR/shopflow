import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProductVariant } from '@/entities/product';

import { adminProductQueryKeys } from '../admin-product-query-keys';

import { productVariantQueryKeys } from './use-product-variants';

type DeleteProductVariantVariables = {
    productId: string;
    variantId: string;
};

export const useDeleteProductVariant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, variantId }: DeleteProductVariantVariables) =>
            deleteProductVariant(productId, variantId),

        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({
                queryKey: productVariantQueryKeys.list(variables.productId),
            });

            await queryClient.invalidateQueries({
                queryKey: adminProductQueryKeys.details(),
            });
        },
    });
};
