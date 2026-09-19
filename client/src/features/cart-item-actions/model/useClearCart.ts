import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cartQueryKeys, clearCart } from '@/entities/cart';

export const useClearCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: clearCart,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: cartQueryKeys.all,
            });
        },
    });
};
