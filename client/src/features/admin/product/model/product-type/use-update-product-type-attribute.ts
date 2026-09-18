import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    updateProductTypeAttribute,
    type UpdateProductTypeAttributeInput,
} from '@/entities/product-type';

import { productTypeQueryKeys } from './product-type-query-keys';

type UpdateProductTypeAttributeVariables = {
    productTypeId: string;
    attributeId: string;
    input: UpdateProductTypeAttributeInput;
};

export const useUpdateProductTypeAttribute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productTypeId,
            attributeId,
            input,
        }: UpdateProductTypeAttributeVariables) =>
            updateProductTypeAttribute(productTypeId, attributeId, input),

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
