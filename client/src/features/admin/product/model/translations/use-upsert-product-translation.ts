import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    upsertProductTranslation,
    type UpsertProductTranslationInput,
} from '@/entities/product';

import { productTranslationQueryKeys } from './use-product-translations';

type UpsertProductTranslationVariables = {
    productId: string;
    language: string;
    input: UpsertProductTranslationInput;
};

export const useUpsertProductTranslation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            language,
            input,
        }: UpsertProductTranslationVariables) =>
            upsertProductTranslation(productId, language, input),

        onSuccess: async (_translation, variables) => {
            await queryClient.invalidateQueries({
                queryKey: productTranslationQueryKeys.list(variables.productId),
            });
        },
    });
};
