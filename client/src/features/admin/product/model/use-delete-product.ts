import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProduct } from '@/entities/product';

import { adminProductQueryKeys } from './admin-product-query-keys';

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteProduct(id),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: adminProductQueryKeys.all,
            });
        },
    });
};
