import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().trim().min(2).max(100),
    slug: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            'Slug must contain only lowercase letters, numbers and hyphens',
        ),
    description: z.string().trim().max(500).optional(),
    imageUrl: z.string().url().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryIdSchema = z.object({
    id: z.string().min(1),
});

export const categorySlugSchema = z.object({
    slug: z.string().min(1),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
