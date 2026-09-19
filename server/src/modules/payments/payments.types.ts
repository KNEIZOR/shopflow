import type { CreateCheckoutInput } from './payments.schema';

export type { CreateCheckoutInput };

export type CheckoutLineItem = {
    name: string;
    quantity: number;
    unitAmount: number;
};

export type CreateCheckoutResult = {
    orderId: string;
    checkoutUrl: string;
};
