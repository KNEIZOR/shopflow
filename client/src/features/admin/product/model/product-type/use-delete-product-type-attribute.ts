import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProductTypeAttribute } from '@/entities/product-type';

import { productTypeQueryKeys } from './product-type-query-keys';

type DeleteProductTypeAttributeVariables = {
    productTypeId: string;
    attributeId: string;
};

export const useDeleteProductTypeAttribute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productTypeId,
            attributeId,
        }: DeleteProductTypeAttributeVariables) =>
            deleteProductTypeAttribute(productTypeId, attributeId),

        onSuccess: (_, { productTypeId, attributeId }) => {
            queryClient.removeQueries({
                queryKey: productTypeQueryKeys.attribute(
                    productTypeId,
                    attributeId,
                ),
            });

            queryClient.invalidateQueries({
                queryKey: productTypeQueryKeys.attributes(productTypeId),
            });

            queryClient.invalidateQueries({
                queryKey: productTypeQueryKeys.detail(productTypeId),
            });

            queryClient.invalidateQueries({
                queryKey: productTypeQueryKeys.lists(),
            });
        },
    });
};
