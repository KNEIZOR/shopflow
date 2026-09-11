import { z } from 'zod';

const languageSchema = z
    .string()
    .trim()
    .min(2)
    .max(10)
    .regex(/^[a-z]{2}(?:-[A-Z]{2})?$/, 'Invalid language code');

export const categoryTranslationParamsSchema = z.object({
    categoryId: z.string().trim().min(1),
});

export const categoryTranslationLanguageParamsSchema =
    categoryTranslationParamsSchema.extend({
        language: languageSchema,
    });

export const upsertCategoryTranslationSchema = z.object({
    name: z.string().trim().min(2).max(100),

    description: z.string().trim().max(500).nullable().optional(),
});

export type UpsertCategoryTranslationInput = z.infer<
    typeof upsertCategoryTranslationSchema
>;
