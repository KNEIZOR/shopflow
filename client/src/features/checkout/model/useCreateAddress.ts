import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    addressQueryKeys,
    createAddress,
    type CreateAddressInput,
} from '@/entities/address';

export const useCreateAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateAddressInput) => createAddress(input),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: addressQueryKeys.all,
            });
        },
    });
};
