import type { CurrencyCode } from '@/shared/config/currencies';

export type CreateCheckoutInput = {
    addressId: string;
    currency: CurrencyCode;
};

export type CreateCheckoutResult = {
    orderId: string;
    checkoutUrl: string;
};

export type CreateCheckoutResponse = {
    success: boolean;
    data: CreateCheckoutResult;
};
