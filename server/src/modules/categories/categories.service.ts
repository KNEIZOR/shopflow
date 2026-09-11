import { Prisma } from '@prisma/client';

import { prisma } from '../../lib/prisma';
import { AppError } from '../../errors/app-error';

import type {
    CreateCategoryInput,
    CategoryListQuery,
    UpdateCategoryInput,
} from './categories.schema';

import type {
    CategoryListResponse,
    CategoryResponse,
} from './categories.types';

const DEFAULT_LANGUAGE = 'ru';

type CategoryWithTranslation = Prisma.CategoryGetPayload<{
    include: {
        translations: {
            where: {
                language: string;
            };
            select: {
                name: true;
                description: true;
            };
            take: 1;
        };
    };
}>;

const mapCategory = (category: CategoryWithTranslation): CategoryResponse => {
    const translation = category.translations[0] ?? null;

    return {
        id: category.id,

        name: translation?.name ?? category.name,

        slug: category.slug,

        description: translation?.description ?? category.description,

        imageUrl: category.imageUrl,

        createdAt: category.createdAt,

        updatedAt: category.updatedAt,
    };
};

const createCategoryInclude = (language: string) => ({
    translations: {
        where: {
            language,
        },

        select: {
            name: true,
            description: true,
        },

        take: 1,
    },
});

export const getCategories = async (
    query: CategoryListQuery = {
        language: DEFAULT_LANGUAGE,
    },
): Promise<CategoryListResponse> => {
    const categories = await prisma.category.findMany({
        include: createCategoryInclude(query.language),

        orderBy: {
            name: 'asc',
        },
    });

    return {
        items: categories.map(mapCategory),
    };
};

export const getCategoryBySlug = async (
    slug: string,
    language = DEFAULT_LANGUAGE,
): Promise<CategoryResponse> => {
    const category = await prisma.category.findUnique({
        where: {
            slug,
        },

        include: createCategoryInclude(language),
    });

    if (!category) {
        throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
    }

    return mapCategory(category);
};

export const createCategory = async (
    input: CreateCategoryInput,
): Promise<CategoryResponse> => {
    const existingCategory = await prisma.category.findFirst({
        where: {
            OR: [
                {
                    name: {
                        equals: input.name,
                        mode: 'insensitive',
                    },
                },

                {
                    slug: input.slug,
                },
            ],
        },

        select: {
            id: true,
        },
    });

    if (existingCategory) {
        throw new AppError(
            409,
            'CATEGORY_ALREADY_EXISTS',
            'Category with this name or slug already exists',
        );
    }

    const category = await prisma.$transaction(async (tx) => {
        const createdCategory = await tx.category.create({
            data: {
                name: input.name,

                slug: input.slug,

                description: input.description,

                imageUrl: input.imageUrl,
            },
        });

        await tx.categoryTranslation.create({
            data: {
                categoryId: createdCategory.id,

                language: DEFAULT_LANGUAGE,

                name: input.name,

                description: input.description,
            },
        });

        return tx.category.findUniqueOrThrow({
            where: {
                id: createdCategory.id,
            },

            include: createCategoryInclude(DEFAULT_LANGUAGE),
        });
    });

    return mapCategory(category);
};

export const updateCategory = async (
    id: string,
    input: UpdateCategoryInput,
): Promise<CategoryResponse> => {
    const existingCategory = await prisma.category.findUnique({
        where: {
            id,
        },

        select: {
            id: true,
            name: true,
            description: true,
        },
    });

    if (!existingCategory) {
        throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
    }

    if (input.name || input.slug) {
        const duplicateCategory = await prisma.category.findFirst({
            where: {
                id: {
                    not: id,
                },

                OR: [
                    ...(input.name
                        ? [
                              {
                                  name: {
                                      equals: input.name,
                                      mode: 'insensitive' as const,
                                  },
                              },
                          ]
                        : []),

                    ...(input.slug
                        ? [
                              {
                                  slug: input.slug,
                              },
                          ]
                        : []),
                ],
            },

            select: {
                id: true,
            },
        });

        if (duplicateCategory) {
            throw new AppError(
                409,
                'CATEGORY_ALREADY_EXISTS',
                'Category with this name or slug already exists',
            );
        }
    }

    await prisma.$transaction(async (tx) => {
        const data: Prisma.CategoryUpdateInput = {};

        if (input.name !== undefined) {
            data.name = input.name;
        }

        if (input.slug !== undefined) {
            data.slug = input.slug;
        }

        if (input.description !== undefined) {
            data.description = input.description;
        }

        if (input.imageUrl !== undefined) {
            data.imageUrl = input.imageUrl;
        }

        if (Object.keys(data).length > 0) {
            await tx.category.update({
                where: {
                    id,
                },

                data,
            });
        }

        if (input.name !== undefined || input.description !== undefined) {
            await tx.categoryTranslation.upsert({
                where: {
                    categoryId_language: {
                        categoryId: id,

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
                    categoryId: id,

                    language: DEFAULT_LANGUAGE,

                    name: input.name ?? existingCategory.name,

                    description:
                        input.description ?? existingCategory.description,
                },
            });
        }
    });

    const category = await prisma.category.findUnique({
        where: {
            id,
        },

        include: createCategoryInclude(DEFAULT_LANGUAGE),
    });

    if (!category) {
        throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
    }

    return mapCategory(category);
};

export const deleteCategory = async (id: string): Promise<void> => {
    const category = await prisma.category.findUnique({
        where: {
            id,
        },

        include: {
            products: {
                select: {
                    id: true,
                },

                take: 1,
            },
        },
    });

    if (!category) {
        throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
    }

    if (category.products.length > 0) {
        throw new AppError(
            409,
            'CATEGORY_HAS_PRODUCTS',
            'Cannot delete a category that contains products',
        );
    }

    await prisma.category.delete({
        where: {
            id,
        },
    });
};
