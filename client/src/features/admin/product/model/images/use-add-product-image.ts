import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createProductImage,
    type CreateProductImageInput,
} from '@/entities/product';

import { adminProductQueryKeys } from '../admin-product-query-keys';

import { productImagesQueryKeys } from './use-product-images';

type CreateProductImageVariables = {
    productId: string;
    input: CreateProductImageInput;
};

export const useAddProductImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, input }: CreateProductImageVariables) =>
            createProductImage(productId, input),

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
