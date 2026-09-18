import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    updateProductType,
    type UpdateProductTypeInput,
} from '@/entities/product-type';

import { productTypeQueryKeys } from './product-type-query-keys';

type UpdateProductTypeVariables = {
    id: string;
    input: UpdateProductTypeInput;
};

export const useUpdateProductType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: UpdateProductTypeVariables) =>
            updateProductType(id, input),

        onSuccess: (productType) => {
            queryClient.setQueryData(
                productTypeQueryKeys.detail(productType.id),
                productType,
            );

            queryClient.invalidateQueries({
                queryKey: productTypeQueryKeys.lists(),
            });
        },
    });
};
