import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    updateProductAttributeValue,
    type UpdateProductAttributeValueInput,
} from '@/entities/product';

import { adminProductQueryKeys } from '../admin-product-query-keys';

type UpdateProductAttributeVariables = {
    productId: string;
    attributeId: string;
    input: UpdateProductAttributeValueInput;
};

export const useUpdateProductAttribute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            attributeId,
            input,
        }: UpdateProductAttributeVariables) =>
            updateProductAttributeValue(productId, attributeId, input),

        onSuccess: async (_attribute, variables) => {
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
