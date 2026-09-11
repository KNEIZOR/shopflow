import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProductTranslation } from '@/entities/product';

import { productTranslationQueryKeys } from './use-product-translations';

type DeleteProductTranslationVariables = {
    productId: string;
    language: string;
};

export const useDeleteProductTranslation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            language,
        }: DeleteProductTranslationVariables) =>
            deleteProductTranslation(productId, language),

        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({
                queryKey: productTranslationQueryKeys.list(variables.productId),
            });
        },
    });
};
