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

export const productPriceParamsSchema = z.object({
    productId: z.string().trim().min(1),
});

export const productPriceCurrencyParamsSchema = productPriceParamsSchema.extend(
    {
        currency: currencySchema,
    },
);

export const upsertProductPriceSchema = z.object({
    amount: positivePriceSchema,
});

export type UpsertProductPriceInput = z.infer<typeof upsertProductPriceSchema>;

export type ProductPriceCurrency = z.infer<typeof currencySchema>;
