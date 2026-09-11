import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createProduct, type CreateProductInput } from '@/entities/product';

import { adminProductQueryKeys } from './admin-product-query-keys';

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateProductInput) => createProduct(input),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: adminProductQueryKeys.lists(),
            });
        },
    });
};
