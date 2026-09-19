import { useMutation } from '@tanstack/react-query';

import { createCheckout } from '@/entities/payment';
import type { CreateCheckoutInput } from '@/entities/payment';

export const useCheckout = () => {
    return useMutation({
        mutationFn: (input: CreateCheckoutInput) => createCheckout(input),
    });
};
