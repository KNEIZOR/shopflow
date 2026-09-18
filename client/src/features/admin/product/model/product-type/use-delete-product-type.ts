import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProductType } from '@/entities/product-type';

import { productTypeQueryKeys } from './product-type-query-keys';

export const useDeleteProductType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productTypeId: string) => deleteProductType(productTypeId),

        onSuccess: (_, productTypeId) => {
            queryClient.removeQueries({
                queryKey: productTypeQueryKeys.detail(productTypeId),
            });

            queryClient.invalidateQueries({
                queryKey: productTypeQueryKeys.lists(),
            });
        },
    });
};
