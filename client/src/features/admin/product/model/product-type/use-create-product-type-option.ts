import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createProductTypeOption,
    type CreateProductTypeOptionInput,
} from '@/entities/product-type';

import { productTypeQueryKeys } from './product-type-query-keys';

type CreateProductTypeOptionVariables = {
    productTypeId: string;
    attributeId: string;
    input: CreateProductTypeOptionInput;
};

export const useCreateProductTypeOption = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productTypeId,
            attributeId,
            input,
        }: CreateProductTypeOptionVariables) =>
            createProductTypeOption(productTypeId, attributeId, input),

        onSuccess: (_, { productTypeId, attributeId }) => {
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
