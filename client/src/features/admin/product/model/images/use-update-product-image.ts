import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    updateProductImage,
    type UpdateProductImageInput,
} from '@/entities/product';

import { adminProductQueryKeys } from '../admin-product-query-keys';

import { productImagesQueryKeys } from './use-product-images';

type UpdateProductImageVariables = {
    productId: string;
    imageId: string;
    input: UpdateProductImageInput;
};

export const useUpdateProductImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            imageId,
            input,
        }: UpdateProductImageVariables) =>
            updateProductImage(productId, imageId, input),

        onSuccess: (_image, variables) => {
            queryClient.invalidateQueries({
                queryKey: productImagesQueryKeys.all(variables.productId),
            });

            queryClient.invalidateQueries({
                queryKey: adminProductQueryKeys.details(),
            });
        },
    });
};
