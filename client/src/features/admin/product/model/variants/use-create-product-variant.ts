import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createProductVariant,
    type CreateProductVariantInput,
} from '@/entities/product';

import { adminProductQueryKeys } from '../admin-product-query-keys';

import { productVariantQueryKeys } from './use-product-variants';

type CreateProductVariantVariables = {
    productId: string;
    input: CreateProductVariantInput;
};

export const useCreateProductVariant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, input }: CreateProductVariantVariables) =>
            createProductVariant(productId, input),

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
