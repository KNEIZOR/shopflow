import { z } from 'zod';

const languageSchema = z
    .string()
    .trim()
    .min(2)
    .max(10)
    .regex(/^[a-z]{2}(?:-[A-Z]{2})?$/, 'Invalid language code');

export const productTranslationParamsSchema = z.object({
    productId: z.string().trim().min(1),
});

export const productTranslationLanguageParamsSchema =
    productTranslationParamsSchema.extend({
        language: languageSchema,
    });

export const upsertProductTranslationSchema = z.object({
    name: z.string().trim().min(2).max(200),

    description: z.string().trim().max(5000).nullable().optional(),
});

export type UpsertProductTranslationInput = z.infer<
    typeof upsertProductTranslationSchema
>;
