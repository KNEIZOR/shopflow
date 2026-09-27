import { z } from 'zod';

export const favoriteProductParamsSchema = z.object({
    productId: z.string().min(1),
});
