import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    updateProductTypeOption,
    type UpdateProductTypeOptionInput,
} from '@/entities/product-type';

import { productTypeQueryKeys } from './product-type-query-keys';

type UpdateProductTypeOptionVariables = {
    productTypeId: string;
    attributeId: string;
    optionId: string;
    input: UpdateProductTypeOptionInput;
};

export const useUpdateProductTypeOption = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productTypeId,
            attributeId,
            optionId,
            input,
        }: UpdateProductTypeOptionVariables) =>
            updateProductTypeOption(
                productTypeId,
                attributeId,
                optionId,
                input,
            ),

        onSuccess: (option, { productTypeId, attributeId }) => {
            queryClient.setQueryData(
                productTypeQueryKeys.option(
                    productTypeId,
                    attributeId,
                    option.id,
                ),
                option,
            );

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
