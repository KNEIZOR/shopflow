import { z } from 'zod';

export const productReviewsParamsSchema = z.object({
    productId: z.string().min(1),
});

export const reviewIdParamsSchema = z.object({
    reviewId: z.string().min(1),
});

export const reviewListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const createReviewSchema = z.object({
    rating: z.coerce.number().int().min(1).max(5),

    comment: z
        .string()
        .trim()
        .max(2000)
        .nullable()
        .optional()
        .transform((value) => {
            if (!value) {
                return null;
            }

            return value;
        }),
});

export const updateReviewSchema = z.object({
    rating: z.coerce.number().int().min(1).max(5).optional(),

    comment: z
        .string()
        .trim()
        .max(2000)
        .nullable()
        .optional()
        .transform((value) => {
            if (value === undefined || value === null || value === '') {
                return null;
            }

            return value;
        }),
});

export type ReviewListQuery = z.infer<typeof reviewListQuerySchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
