import { z } from 'zod';

export const createOrderSchema = z.object({
    addressId: z.string().cuid('Invalid address ID'),

    items: z
        .array(
            z.object({
                variantId: z.string().cuid('Invalid variant ID'),

                quantity: z.number().int().min(1).max(100),
            }),
        )
        .min(1, 'Order must contain at least one item')
        .max(50, 'Too many items in order'),
});

export const orderIdParamsSchema = z.object({
    orderId: z.string().cuid('Invalid order ID'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export type OrderIdParams = z.infer<typeof orderIdParamsSchema>;
