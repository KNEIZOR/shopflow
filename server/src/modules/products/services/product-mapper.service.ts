import type { CurrencyCode } from '@prisma/client';

import type { ProductResponse } from '../products.types';

import type { ProductWithRelations } from './product.include';

import {
    getProductDisplayPrice,
    getVariantDisplayPrice,
} from './product-price.service';

const DEFAULT_CURRENCY: CurrencyCode = 'RUB';

export const mapProduct = (
    product: ProductWithRelations,
    currency: CurrencyCode,
): ProductResponse => {
    const translation = product.translations[0] ?? null;

    const displayPrice = getProductDisplayPrice(product, currency);

    const name = translation?.name ?? product.name;

    const description = translation?.description ?? product.description;

    const productAttributeRelations = new Map(
        product.productType?.attributes.map((relation) => [
            relation.attributeId,
            relation,
        ]) ?? [],
    );

    const attributes = product.attributeValues
        .map((value) => {
            const relation = productAttributeRelations.get(value.attributeId);

            if (!relation) {
                return null;
            }

            return {
                id: value.id,

                attributeId: value.attributeId,

                value: value.value,

                attribute: {
                    id: value.attribute.id,

                    name: value.attribute.name,

                    slug: value.attribute.slug,

                    description: value.attribute.description,

                    type: value.attribute.type,

                    scope: value.attribute.scope,

                    isRequired: relation.isRequired,

                    position: relation.position,
                },
            };
        })
        .filter((value): value is NonNullable<typeof value> => value !== null)
        .sort((a, b) => a.attribute.position - b.attribute.position);

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

                  attributes: product.productType.attributes.map(
                      (relation) => ({
                          id: relation.id,

                          attributeId: relation.attributeId,

                          isRequired: relation.isRequired,

                          position: relation.position,

                          attribute: {
                              id: relation.attribute.id,

                              name: relation.attribute.name,

                              slug: relation.attribute.slug,

                              description: relation.attribute.description,

                              type: relation.attribute.type,

                              scope: relation.attribute.scope,
                          },

                          options: relation.options.map((option) => ({
                              id: option.id,

                              value: option.value,

                              label: option.label,

                              position: option.position,
                          })),
                      }),
                  ),
              }
            : null,

        attributes,

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

                attributes: variant.attributeValues.map((attributeValue) => ({
                    id: attributeValue.id,

                    attributeId: attributeValue.attributeId,

                    value: attributeValue.value,

                    attribute: {
                        id: attributeValue.attribute.id,

                        name: attributeValue.attribute.name,

                        slug: attributeValue.attribute.slug,

                        description: attributeValue.attribute.description,

                        type: attributeValue.attribute.type,

                        scope: attributeValue.attribute.scope,
                    },
                })),
            };
        }),

        createdAt: product.createdAt,

        updatedAt: product.updatedAt,
    };
};
