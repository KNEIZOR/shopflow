import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProductAttributeValue } from '@/entities/product';

import { adminProductQueryKeys } from '../admin-product-query-keys';

type DeleteProductAttributeVariables = {
    productId: string;
    attributeId: string;
};

export const useDeleteProductAttribute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            attributeId,
        }: DeleteProductAttributeVariables) =>
            deleteProductAttributeValue(productId, attributeId),

        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({
                queryKey: adminProductQueryKeys.attributeList(
                    variables.productId,
                ),
            });

            await queryClient.invalidateQueries({
                queryKey: adminProductQueryKeys.details(),
            });
        },
    });
};
