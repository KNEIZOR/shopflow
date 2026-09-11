import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateProduct, type UpdateProductInput } from '@/entities/product';

import { adminProductQueryKeys } from './admin-product-query-keys';

type UpdateProductVariables = {
    id: string;
    input: UpdateProductInput;
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: UpdateProductVariables) =>
            updateProduct(id, input),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: adminProductQueryKeys.all,
            });
        },
    });
};
