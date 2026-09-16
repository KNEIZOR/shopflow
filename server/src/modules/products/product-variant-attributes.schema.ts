import { z } from 'zod';

const attributeValueSchema = z.union([
    z.string().trim().max(5000),
    z.number().finite(),
    z.boolean(),
]);

export const productVariantAttributeParamsSchema = z.object({
    productId: z.string().trim().min(1),

    variantId: z.string().trim().min(1),

    attributeId: z.string().trim().min(1),
});

export const productVariantAttributeProductParamsSchema = z.object({
    productId: z.string().trim().min(1),

    variantId: z.string().trim().min(1),
});

export const createProductVariantAttributeValueSchema = z.object({
    attributeId: z.string().trim().min(1),

    value: attributeValueSchema,
});

export const updateProductVariantAttributeValueSchema = z.object({
    value: attributeValueSchema,
});

export type CreateProductVariantAttributeValueInput = z.infer<
    typeof createProductVariantAttributeValueSchema
>;

export type UpdateProductVariantAttributeValueInput = z.infer<
    typeof updateProductVariantAttributeValueSchema
>;
