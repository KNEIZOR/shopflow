import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    updateProductVariantAttributeValue,
    type UpdateProductVariantAttributeValueInput,
} from '@/entities/product';

import { productVariantAttributeQueryKeys } from './product-variant-attribute-query-keys';

export const useUpdateProductVariantAttribute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            variantId,
            attributeId,
            input,
        }: {
            productId: string;
            variantId: string;
            attributeId: string;
            input: UpdateProductVariantAttributeValueInput;
        }) =>
            updateProductVariantAttributeValue(
                productId,
                variantId,
                attributeId,
                input,
            ),

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
