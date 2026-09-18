import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProductVariantAttributeValue } from '@/entities/product';

import { productVariantAttributeQueryKeys } from './product-variant-attribute-query-keys';

export const useDeleteProductVariantAttribute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            variantId,
            attributeId,
        }: {
            productId: string;
            variantId: string;
            attributeId: string;
        }) =>
            deleteProductVariantAttributeValue(
                productId,
                variantId,
                attributeId,
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
