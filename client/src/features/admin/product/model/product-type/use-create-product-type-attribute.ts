import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createProductTypeAttribute,
    type CreateProductTypeAttributeInput,
} from '@/entities/product-type';

import { productTypeQueryKeys } from './product-type-query-keys';

type CreateProductTypeAttributeVariables = {
    productTypeId: string;
    input: CreateProductTypeAttributeInput;
};

export const useCreateProductTypeAttribute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productTypeId,
            input,
        }: CreateProductTypeAttributeVariables) =>
            createProductTypeAttribute(productTypeId, input),

        onSuccess: (attribute, { productTypeId }) => {
            queryClient.setQueryData(
                productTypeQueryKeys.attribute(productTypeId, attribute.id),
                attribute,
            );

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
