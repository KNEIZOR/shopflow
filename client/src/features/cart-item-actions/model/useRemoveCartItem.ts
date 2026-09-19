import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cartQueryKeys, removeCartItem } from '@/entities/cart';

export const useRemoveCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (itemId: string) => removeCartItem(itemId),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: cartQueryKeys.all,
            });
        },
    });
};
