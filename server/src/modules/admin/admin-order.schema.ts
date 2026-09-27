import { z } from 'zod';

export const adminOrderListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(20),

    search: z.string().trim().max(100).optional(),

    status: z
        .enum([
            'PENDING',
            'CONFIRMED',
            'PROCESSING',
            'SHIPPED',
            'DELIVERED',
            'CANCELLED',
        ])
        .optional(),

    paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),

    sort: z
        .enum(['newest', 'oldest', 'total_desc', 'total_asc'])
        .default('newest'),
});

export const adminOrderIdParamsSchema = z.object({
    orderId: z.string().cuid('Invalid order ID'),
});

export const updateAdminOrderStatusSchema = z.object({
    status: z.enum([
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
    ]),
});

export type AdminOrderListQuery = z.infer<typeof adminOrderListQuerySchema>;

export type AdminOrderIdParams = z.infer<typeof adminOrderIdParamsSchema>;

export type UpdateAdminOrderStatusInput = z.infer<
    typeof updateAdminOrderStatusSchema
>;
