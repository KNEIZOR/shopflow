import { z } from 'zod';

const productStatusSchema = z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']);

const currencySchema = z.enum(['RUB', 'EUR', 'USD', 'AMD']);

const languageSchema = z
    .string()
    .trim()
    .min(2)
    .max(10)
    .regex(/^[a-z]{2}(?:-[A-Z]{2})?$/, 'Invalid language code');

const positivePriceSchema = z.coerce
    .number()
    .finite()
    .min(0)
    .max(99999999.99)
    .refine(
        (value) => Number.isInteger(value * 100),
        'Price must have no more than 2 decimal places',
    );

const productTypeIdOptionalSchema = z.string().trim().min(1).optional();

export const createProductSchema = z.object({
    name: z.string().trim().min(2).max(200),

    slug: z
        .string()
        .trim()
        .min(2)
        .max(200)
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            'Slug must contain only lowercase letters, numbers and hyphens',
        ),

    description: z.string().trim().max(5000).optional(),

    /**
     * Current base price.
     * ShopFlow currently uses RUB as the base currency.
     */
    price: positivePriceSchema,

    status: productStatusSchema.default('DRAFT'),

    categoryId: z.string().trim().min(1),

    productTypeId: productTypeIdOptionalSchema,
});

export const updateProductSchema = createProductSchema.partial();

export const productIdSchema = z.object({
    id: z.string().trim().min(1),
});

export const productSlugSchema = z.object({
    slug: z.string().trim().min(1),
});

export const productListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(20),

    search: z.string().trim().max(100).optional(),

    category: z.string().trim().max(100).optional(),

    status: productStatusSchema.optional(),

    minPrice: z.coerce.number().finite().min(0).optional(),

    maxPrice: z.coerce.number().finite().min(0).optional(),

    sort: z
        .enum([
            'newest',
            'oldest',
            'price_asc',
            'price_desc',
            'name_asc',
            'name_desc',
        ])
        .default('newest'),

    language: languageSchema.default('ru'),

    currency: currencySchema.default('RUB'),
});

export const createProductImageSchema = z.object({
    url: z.string().trim().url().max(2048),

    alt: z.string().trim().max(200).optional(),

    position: z.coerce.number().int().min(0).max(100).optional(),
});

export const updateProductImageSchema = createProductImageSchema.partial();

export const productImageParamsSchema = z.object({
    productId: z.string().trim().min(1),

    imageId: z.string().trim().min(1),
});

export const createProductVariantSchema = z.object({
    name: z.string().trim().min(1).max(100),

    sku: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/, 'Invalid SKU format'),

    /**
     * Current variant base price in RUB.
     */
    price: positivePriceSchema.optional(),

    stock: z.coerce.number().int().min(0).max(1000000).default(0),
});

export const updateProductVariantSchema = createProductVariantSchema
    .omit({
        stock: true,
    })
    .partial()
    .extend({
        price: positivePriceSchema.nullable().optional(),

        stock: z.coerce.number().int().min(0).max(1000000).optional(),
    });

export const productVariantParamsSchema = z.object({
    productId: z.string().trim().min(1),

    variantId: z.string().trim().min(1),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export type ProductListQuery = z.infer<typeof productListQuerySchema>;

export type ProductStatus = z.infer<typeof productStatusSchema>;

export type CurrencyCode = z.infer<typeof currencySchema>;
