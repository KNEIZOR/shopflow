import type { CurrencyCode } from '@prisma/client';

import type { ProductResponse } from '../products.types';

import type { ProductWithRelations } from './product.include';

import {
    getProductDisplayPrice,
    getVariantDisplayPrice,
} from './product-price.service';

const DEFAULT_CURRENCY: CurrencyCode = 'RUB';

const getTranslation = (translations: ProductWithRelations['translations']) => {
    return translations[0] ?? null;
};

export const mapProduct = (
    product: ProductWithRelations,
    currency: CurrencyCode,
): ProductResponse => {
    const translation = getTranslation(product.translations);

    const displayPrice = getProductDisplayPrice(product, currency);

    const name = translation?.name ?? product.name;

    const description = translation?.description ?? product.description;

    return {
        id: product.id,

        name,

        slug: product.slug,

        description,

        price: displayPrice.amount.toFixed(2),

        currency: displayPrice.currency,

        status: product.status,

        category: {
            id: product.category.id,

            name:
                product.category.translations[0]?.name ?? product.category.name,

            slug: product.category.slug,
        },

        productType: product.productType
            ? {
                  id: product.productType.id,

                  name: product.productType.name,

                  slug: product.productType.slug,
              }
            : null,

        images: product.images.map((image) => ({
            id: image.id,

            url: image.url,

            alt: image.alt,

            position: image.position,
        })),

        variants: product.variants.map((variant) => {
            const displayVariantPrice = getVariantDisplayPrice(
                variant,
                currency,
            );

            return {
                id: variant.id,

                name: variant.name,

                sku: variant.sku,

                price: displayVariantPrice?.amount.toFixed(2) ?? null,

                currency: displayVariantPrice?.currency ?? DEFAULT_CURRENCY,

                stock: variant.stock,
            };
        }),

        createdAt: product.createdAt,

        updatedAt: product.updatedAt,
    };
};
