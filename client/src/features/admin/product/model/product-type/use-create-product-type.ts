import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createProductType,
    type CreateProductTypeInput,
} from '@/entities/product-type';

import { productTypeQueryKeys } from './product-type-query-keys';

export const useCreateProductType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateProductTypeInput) => createProductType(input),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: productTypeQueryKeys.lists(),
            });
        },
    });
};
