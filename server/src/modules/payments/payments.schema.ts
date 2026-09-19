import { z } from 'zod';

const currencySchema = z.enum(['RUB', 'EUR', 'USD', 'AMD']);

export const createCheckoutSchema = z.object({
    addressId: z.string().cuid('Invalid address ID'),
    currency: currencySchema,
});

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;
export type CheckoutCurrency = z.infer<typeof currencySchema>;
