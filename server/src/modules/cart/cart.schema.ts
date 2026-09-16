import { z } from 'zod';

import { CART_LIMITS } from './cart.constants';

const idSchema = z.string().trim().min(1).max(100);

const quantitySchema = z.coerce
    .number()
    .int()
    .min(1)
    .max(CART_LIMITS.MAX_ITEM_QUANTITY);

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
