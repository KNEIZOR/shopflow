import { z } from 'zod';

export const createOrderSchema = z.object({
    addressId: z.string().cuid('Invalid address ID'),
});

export const orderIdParamsSchema = z.object({
    orderId: z.string().cuid('Invalid order ID'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export type OrderIdParams = z.infer<typeof orderIdParamsSchema>;
