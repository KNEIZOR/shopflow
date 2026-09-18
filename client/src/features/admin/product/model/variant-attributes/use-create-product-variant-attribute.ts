import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createProductVariantAttributeValue,
    type CreateProductVariantAttributeValueInput,
} from '@/entities/product';

import { productVariantAttributeQueryKeys } from './product-variant-attribute-query-keys';

export const useCreateProductVariantAttribute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            variantId,
            input,
        }: {
            productId: string;
            variantId: string;
            input: CreateProductVariantAttributeValueInput;
        }) => createProductVariantAttributeValue(productId, variantId, input),

        onSuccess: (_, variables) => {
            void queryClient.invalidateQueries({
                queryKey: productVariantAttributeQueryKeys.list(
                    variables.productId,
                    variables.variantId,
                ),
            });
        },
    });
};
