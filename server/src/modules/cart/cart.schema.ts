import { z } from 'zod';

import { CART_LIMITS } from './cart.constants';

const idSchema = z.string().trim().min(1).max(100);

const quantitySchema = z.coerce
    .number()
    .int()
    .min(1)
    .max(CART_LIMITS.MAX_ITEM_QUANTITY);

const currencySchema = z.enum(['RUB', 'EUR', 'USD', 'AMD']);

export const addCartItemSchema = z.object({
    productId: idSchema,
    variantId: idSchema,
    quantity: quantitySchema,
});

export const updateCartItemSchema = z.object({
    quantity: quantitySchema,
});

export const cartItemParamsSchema = z.object({
    itemId: idSchema,
});

export const getCartQuerySchema = z.object({
    currency: currencySchema.default('RUB'),
});

export type CartCurrency = z.infer<typeof currencySchema>;
