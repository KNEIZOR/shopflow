import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProductImage } from '@/entities/product';

import { adminProductQueryKeys } from '../admin-product-query-keys';

import { productImagesQueryKeys } from './use-product-images';

type DeleteProductImageVariables = {
    productId: string;
    imageId: string;
};

export const useDeleteProductImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, imageId }: DeleteProductImageVariables) =>
            deleteProductImage(productId, imageId),

        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: productImagesQueryKeys.all(variables.productId),
            });

            queryClient.invalidateQueries({
                queryKey: adminProductQueryKeys.details(),
            });
        },
    });
};
