import { Prisma, type CurrencyCode } from '@prisma/client';

import { prisma } from '../../../lib/prisma';

import type { UpdateProductInput } from '../products.schema';

import type { ProductResponse } from '../products.types';

import { createProductInclude } from './product.include';

import { mapProduct } from './product-mapper.service';

import {
    ensureCategoryExists,
    ensureProductExists,
    ensureProductNameOrSlugAvailable,
    ensureProductTypeExists,
} from './product-validation.service';

import { validateProductCanBeActivated } from './product-activation-validation.service';

const DEFAULT_LANGUAGE = 'ru';

const DEFAULT_CURRENCY: CurrencyCode = 'RUB';

export const updateProduct = async (
    id: string,
    input: UpdateProductInput,
): Promise<ProductResponse> => {
    const existingProduct = await ensureProductExists(id);

    if (input.categoryId !== undefined) {
        await ensureCategoryExists(input.categoryId);
    }

    if (input.productTypeId !== undefined) {
        await ensureProductTypeExists(input.productTypeId);
    }

    await ensureProductNameOrSlugAvailable(input.name, input.slug, id);

    const targetStatus = input.status ?? existingProduct.status;

    const targetProductTypeId =
        input.productTypeId !== undefined
            ? input.productTypeId
            : existingProduct.productTypeId;

    if (targetStatus === 'ACTIVE') {
        await validateProductCanBeActivated(id, targetProductTypeId);
    }

    await prisma.$transaction(async (tx) => {
        const data: Prisma.ProductUpdateInput = {};

        if (input.name !== undefined) {
            data.name = input.name;
        }

        if (input.slug !== undefined) {
            data.slug = input.slug;
        }

        if (input.description !== undefined) {
            data.description = input.description;
        }

        if (input.price !== undefined) {
            const price = new Prisma.Decimal(input.price.toFixed(2));

            data.price = price;

            await tx.productPrice.upsert({
                where: {
                    productId_currency: {
                        productId: id,
                        currency: DEFAULT_CURRENCY,
                    },
                },

                update: {
                    amount: price,
                },

                create: {
                    productId: id,
                    currency: DEFAULT_CURRENCY,
                    amount: price,
                },
            });
        }

        if (input.status !== undefined) {
            data.status = input.status;
        }

        if (input.categoryId !== undefined) {
            data.category = {
                connect: {
                    id: input.categoryId,
                },
            };
        }

        if (input.productTypeId !== undefined) {
            data.productType = {
                connect: {
                    id: input.productTypeId,
                },
            };
        }

        if (Object.keys(data).length > 0) {
            await tx.product.update({
                where: {
                    id,
                },

                data,
            });
        }

        if (input.name !== undefined || input.description !== undefined) {
            await tx.productTranslation.upsert({
                where: {
                    productId_language: {
                        productId: id,
                        language: DEFAULT_LANGUAGE,
                    },
                },

                update: {
                    ...(input.name !== undefined
                        ? {
                              name: input.name,
                          }
                        : {}),

                    ...(input.description !== undefined
                        ? {
                              description: input.description,
                          }
                        : {}),
                },

                create: {
                    productId: id,

                    language: DEFAULT_LANGUAGE,

                    name: input.name ?? existingProduct.name,

                    description:
                        input.description ?? existingProduct.description,
                },
            });
        }
    });

    const product = await prisma.product.findUnique({
        where: {
            id,
        },

        include: createProductInclude(DEFAULT_LANGUAGE, DEFAULT_CURRENCY),
    });

    if (!product) {
        throw new Error('Product disappeared after update');
    }

    return mapProduct(product, DEFAULT_CURRENCY);
};
