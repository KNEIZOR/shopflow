import { z } from 'zod';
import { ProductAttributeScope, ProductAttributeType } from '@prisma/client';

const slugSchema = z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug must contain only lowercase letters, numbers and hyphens',
    );

export const productTypeIdSchema = z.object({
    id: z.string().trim().min(1),
});

export const productTypeSlugSchema = z.object({
    slug: z.string().trim().min(1),
});

export const productTypeAttributeIdSchema = z.object({
    attributeId: z.string().trim().min(1),
});

export const productTypeOptionIdSchema = z.object({
    optionId: z.string().trim().min(1),
});

/**
 * Product type
 */

export const createProductTypeSchema = z.object({
    name: z.string().trim().min(2).max(100),

    slug: slugSchema,

    description: z.string().trim().max(500).optional(),
});

export const updateProductTypeSchema = createProductTypeSchema.partial();

/**
 * Product type attribute
 *
 * An attribute is global and can be reused
 * by multiple product types.
 */

export const createProductTypeAttributeSchema = z.object({
    name: z.string().trim().min(2).max(100),

    slug: slugSchema,

    description: z.string().trim().max(500).optional(),

    type: z.nativeEnum(ProductAttributeType),

    scope: z.nativeEnum(ProductAttributeScope).optional(),

    isRequired: z.boolean().optional(),

    position: z.number().int().min(0).optional(),
});

export const updateProductTypeAttributeSchema =
    createProductTypeAttributeSchema.partial();

/**
 * Product attribute option
 *
 * Options are available only for SELECT attributes.
 */

export const createProductTypeOptionSchema = z.object({
    value: z.string().trim().min(1).max(100),

    label: z.string().trim().min(1).max(100),

    position: z.number().int().min(0).optional(),
});

export const updateProductTypeOptionSchema =
    createProductTypeOptionSchema.partial();

/**
 * Types
 */

export type CreateProductTypeInput = z.infer<typeof createProductTypeSchema>;

export type UpdateProductTypeInput = z.infer<typeof updateProductTypeSchema>;

export type CreateProductTypeAttributeInput = z.infer<
    typeof createProductTypeAttributeSchema
>;

export type UpdateProductTypeAttributeInput = z.infer<
    typeof updateProductTypeAttributeSchema
>;

export type CreateProductTypeOptionInput = z.infer<
    typeof createProductTypeOptionSchema
>;

export type UpdateProductTypeOptionInput = z.infer<
    typeof updateProductTypeOptionSchema
>;
