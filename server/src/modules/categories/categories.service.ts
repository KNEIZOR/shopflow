import { prisma } from '../../lib/prisma';
import { AppError } from '../../errors/app-error';

import type {
    CreateCategoryInput,
    UpdateCategoryInput,
} from './categories.schema';
import type { CategoryResponse } from './categories.types';

const mapCategory = (category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}): CategoryResponse => {
    return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
    };
};

export const getCategories = async (): Promise<CategoryResponse[]> => {
    const categories = await prisma.category.findMany({
        orderBy: {
            name: 'asc',
        },
    });

    return categories.map(mapCategory);
};

export const getCategoryBySlug = async (
    slug: string,
): Promise<CategoryResponse> => {
    const category = await prisma.category.findUnique({
        where: {
            slug,
        },
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
    });

    if (existingCategory) {
        throw new AppError(
            409,
            'CATEGORY_ALREADY_EXISTS',
            'Category with this name or slug already exists',
        );
    }

    const category = await prisma.category.create({
        data: {
            name: input.name,
            slug: input.slug,
            description: input.description,
            imageUrl: input.imageUrl,
        },
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
        });

        if (duplicateCategory) {
            throw new AppError(
                409,
                'CATEGORY_ALREADY_EXISTS',
                'Category with this name or slug already exists',
            );
        }
    }

    const category = await prisma.category.update({
        where: {
            id,
        },
        data: input,
    });

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
