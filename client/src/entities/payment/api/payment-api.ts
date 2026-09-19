import { apiRequest } from '@/shared/api';

import type {
    CreateCheckoutInput,
    CreateCheckoutResponse,
    CreateCheckoutResult,
} from '../model/types';

export const createCheckout = async (
    input: CreateCheckoutInput,
): Promise<CreateCheckoutResult> => {
    const response = await apiRequest<CreateCheckoutResponse>(
        '/payments/checkout',
        {
            method: 'POST',
            body: JSON.stringify(input),
        },
    );

    return response.data;
};
