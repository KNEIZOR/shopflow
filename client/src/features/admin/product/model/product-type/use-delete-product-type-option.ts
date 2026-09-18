import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProductTypeOption } from '@/entities/product-type';

import { productTypeQueryKeys } from './product-type-query-keys';

type DeleteProductTypeOptionVariables = {
    productTypeId: string;
    attributeId: string;
    optionId: string;
};

export const useDeleteProductTypeOption = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productTypeId,
            attributeId,
            optionId,
        }: DeleteProductTypeOptionVariables) =>
            deleteProductTypeOption(productTypeId, attributeId, optionId),

        onSuccess: (_, { productTypeId, attributeId, optionId }) => {
            queryClient.removeQueries({
                queryKey: productTypeQueryKeys.option(
                    productTypeId,
                    attributeId,
                    optionId,
                ),
            });

            queryClient.invalidateQueries({
                queryKey: productTypeQueryKeys.options(
                    productTypeId,
                    attributeId,
                ),
            });

            queryClient.invalidateQueries({
                queryKey: productTypeQueryKeys.attribute(
                    productTypeId,
                    attributeId,
                ),
            });

            queryClient.invalidateQueries({
                queryKey: productTypeQueryKeys.detail(productTypeId),
            });
        },
    });
};
