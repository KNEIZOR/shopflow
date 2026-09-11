import { z } from 'zod';

const languageSchema = z
    .string()
    .trim()
    .min(2)
    .max(10)
    .regex(/^[a-z]{2}(?:-[A-Z]{2})?$/, 'Invalid language code');

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
    id: z.string().trim().min(1),
});

export const categorySlugSchema = z.object({
    slug: z.string().trim().min(1),
});

export const categoryListQuerySchema = z.object({
    language: languageSchema.default('ru'),
});

export const categoryLanguageQuerySchema = categoryListQuerySchema;

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;
