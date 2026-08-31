import { z } from 'zod';

export const createCheckoutSchema = z.object({
    addressId: z.string().min(1, 'Address ID is required'),
});

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;
