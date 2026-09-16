import { Prisma, type CurrencyCode } from '@prisma/client';

import { prisma } from '../../../lib/prisma';

import type { CreateProductInput } from '../products.schema';

import type { ProductResponse } from '../products.types';

import { createProductInclude } from './product.include';

import { mapProduct } from './product-mapper.service';

import {
    ensureCategoryExists,
    ensureNewProductAvailable,
    ensureProductTypeExists,
} from './product-validation.service';

import { validateProductCanBeActivated } from './product-activation-validation.service';

const DEFAULT_LANGUAGE = 'ru';

const DEFAULT_CURRENCY: CurrencyCode = 'RUB';

export const createProduct = async (
    input: CreateProductInput,
): Promise<ProductResponse> => {
    await ensureNewProductAvailable(input.name, input.slug);

    await ensureCategoryExists(input.categoryId);

    if (input.productTypeId) {
        await ensureProductTypeExists(input.productTypeId);
    }

    const requestedStatus = input.status;

    const product = await prisma.$transaction(async (tx) => {
        const price = new Prisma.Decimal(input.price.toFixed(2));

        const productData: Prisma.ProductCreateInput = {
            name: input.name,

            slug: input.slug,

            description: input.description,

            price,

            // A newly created product is
            // always persisted as DRAFT first.
            //
            // This allows activation validation
            // to run against the actual persisted
            // product and its relations.
            status: 'DRAFT',

            category: {
                connect: {
                    id: input.categoryId,
                },
            },

            ...(input.productTypeId
                ? {
                      productType: {
                          connect: {
                              id: input.productTypeId,
                          },
                      },
                  }
                : {}),
        };

        const createdProduct = await tx.product.create({
            data: productData,
        });

        await tx.productTranslation.create({
            data: {
                productId: createdProduct.id,

                language: DEFAULT_LANGUAGE,

                name: input.name,

                description: input.description,
            },
        });

        await tx.productPrice.create({
            data: {
                productId: createdProduct.id,

                currency: DEFAULT_CURRENCY,

                amount: price,
            },
        });

        return tx.product.findUniqueOrThrow({
            where: {
                id: createdProduct.id,
            },

            include: createProductInclude(DEFAULT_LANGUAGE, DEFAULT_CURRENCY),
        });
    });

    if (requestedStatus === 'ACTIVE') {
        await validateProductCanBeActivated(product.id, input.productTypeId);

        const activatedProduct = await prisma.product.update({
            where: {
                id: product.id,
            },

            data: {
                status: 'ACTIVE',
            },

            include: createProductInclude(DEFAULT_LANGUAGE, DEFAULT_CURRENCY),
        });

        return mapProduct(activatedProduct, DEFAULT_CURRENCY);
    }

    return mapProduct(product, DEFAULT_CURRENCY);
};
