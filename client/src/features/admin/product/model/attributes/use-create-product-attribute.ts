import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createProductAttributeValue,
    type CreateProductAttributeValueInput,
} from '@/entities/product';

import { adminProductQueryKeys } from '../admin-product-query-keys';

type CreateProductAttributeVariables = {
    productId: string;
    input: CreateProductAttributeValueInput;
};

export const useCreateProductAttribute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, input }: CreateProductAttributeVariables) =>
            createProductAttributeValue(productId, input),

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
