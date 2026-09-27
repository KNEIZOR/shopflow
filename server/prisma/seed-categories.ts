import { PrismaClient } from '@prisma/client';

import { categories } from './seed/data/categories';

export const seedCategories = async (prisma: PrismaClient) => {
    const categoryMap = new Map<string, string>();

    for (const category of categories) {
        const result = await prisma.category.upsert({
            where: {
                slug: category.slug,
            },

            update: {
                name: category.name,
                description: category.description,
                imageUrl: category.imageUrl,

                translations: {
                    deleteMany: {},

                    create: category.translations,
                },
            },

            create: {
                name: category.name,
                slug: category.slug,
                description: category.description,
                imageUrl: category.imageUrl,

                translations: {
                    create: category.translations,
                },
            },
        });

        categoryMap.set(category.slug, result.id);
    }

    return categoryMap;
};
