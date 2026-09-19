import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    addCartItem,
    cartQueryKeys,
    type AddCartItemInput,
} from '@/entities/cart';

export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: AddCartItemInput) => addCartItem(input),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: cartQueryKeys.all,
            });
        },
    });
};
