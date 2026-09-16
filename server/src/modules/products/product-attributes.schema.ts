import { z } from 'zod';

const attributeValueSchema = z.union([
    z.string().trim().max(5000),
    z.number().finite(),
    z.boolean(),
]);

export const productAttributeParamsSchema = z.object({
    productId: z.string().trim().min(1),

    attributeId: z.string().trim().min(1),
});

export const createProductAttributeValueSchema = z.object({
    attributeId: z.string().trim().min(1),

    value: attributeValueSchema,
});

export const updateProductAttributeValueSchema = z.object({
    value: attributeValueSchema,
});

export type CreateProductAttributeValueInput = z.infer<
    typeof createProductAttributeValueSchema
>;

export type UpdateProductAttributeValueInput = z.infer<
    typeof updateProductAttributeValueSchema
>;
