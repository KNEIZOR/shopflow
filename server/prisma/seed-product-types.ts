import { PrismaClient } from '@prisma/client';

import { productTypes } from './seed/data/product-types';

export const seedProductTypes = async (prisma: PrismaClient) => {
    const productTypeMap = new Map<string, string>();

    for (const productType of productTypes) {
        const existing = await prisma.productType.upsert({
            where: {
                slug: productType.slug,
            },

            update: {
                name: productType.name,
                description: productType.description,
            },

            create: {
                name: productType.name,
                slug: productType.slug,
                description: productType.description,
            },
        });

        productTypeMap.set(productType.slug, existing.id);

        for (const attribute of productType.attributes) {
            const dbAttribute = await prisma.productAttribute.upsert({
                where: {
                    slug: attribute.slug,
                },

                update: {
                    name: attribute.name,
                    type: attribute.type,
                    scope: attribute.scope,
                },

                create: {
                    name: attribute.name,
                    slug: attribute.slug,
                    type: attribute.type,
                    scope: attribute.scope,
                },
            });

            const typeAttribute = await prisma.productTypeAttribute.upsert({
                where: {
                    productTypeId_attributeId: {
                        productTypeId: existing.id,
                        attributeId: dbAttribute.id,
                    },
                },

                update: {
                    isRequired: attribute.required ?? false,
                },

                create: {
                    productTypeId: existing.id,
                    attributeId: dbAttribute.id,
                    isRequired: attribute.required ?? false,
                },
            });

            if (attribute.options?.length) {
                await prisma.productAttributeOption.deleteMany({
                    where: {
                        productTypeAttributeId: typeAttribute.id,
                    },
                });

                await prisma.productAttributeOption.createMany({
                    data: attribute.options.map((value, index) => ({
                        value,
                        label: value,
                        position: index,
                        productTypeAttributeId: typeAttribute.id,
                    })),
                });
            }
        }
    }

    return productTypeMap;
};
