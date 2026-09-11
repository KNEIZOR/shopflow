import { z } from 'zod';

const currencySchema = z.enum(['RUB', 'EUR', 'USD', 'GBP']);

const positivePriceSchema = z.coerce
    .number()
    .finite()
    .min(0)
    .max(99999999.99)
    .refine(
        (value) => Number.isInteger(value * 100),
        'Price must have no more than 2 decimal places',
    );

export const productVariantPriceParamsSchema = z.object({
    productId: z.string().trim().min(1),

    variantId: z.string().trim().min(1),
});

export const productVariantPriceCurrencyParamsSchema =
    productVariantPriceParamsSchema.extend({
        currency: currencySchema,
    });

export const upsertProductVariantPriceSchema = z.object({
    amount: positivePriceSchema,
});

export type UpsertProductVariantPriceInput = z.infer<
    typeof upsertProductVariantPriceSchema
>;

export type ProductVariantPriceCurrency = z.infer<typeof currencySchema>;
