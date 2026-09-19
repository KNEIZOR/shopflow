import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    cartQueryKeys,
    updateCartItem,
    type UpdateCartItemInput,
} from '@/entities/cart';

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            itemId,
            input,
        }: {
            itemId: string;
            input: UpdateCartItemInput;
        }) => updateCartItem(itemId, input),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: cartQueryKeys.all,
            });
        },
    });
};
