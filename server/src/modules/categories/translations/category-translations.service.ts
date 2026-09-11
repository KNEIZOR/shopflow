import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import type { UpsertCategoryTranslationInput } from './category-translations.schema';

import type {
    CategoryTranslationResponse,
    CategoryTranslationsResponse,
} from './category-translations.types';

const DEFAULT_LANGUAGE = 'ru';

type CategoryTranslationRecord = {
    id: string;
    categoryId: string;
    language: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
};

const mapTranslation = (
    translation: CategoryTranslationRecord,
): CategoryTranslationResponse => {
    return {
        id: translation.id,
        categoryId: translation.categoryId,
        language: translation.language,
        name: translation.name,
        description: translation.description,
        createdAt: translation.createdAt,
        updatedAt: translation.updatedAt,
    };
};

const ensureCategoryExists = async (categoryId: string): Promise<void> => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
        select: {
            id: true,
        },
    });

    if (!category) {
        throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
    }
};

export const getCategoryTranslations = async (
    categoryId: string,
): Promise<CategoryTranslationsResponse> => {
    await ensureCategoryExists(categoryId);

    const translations = await prisma.categoryTranslation.findMany({
        where: {
            categoryId,
        },
        orderBy: {
            language: 'asc',
        },
    });

    return {
        items: translations.map(mapTranslation),
    };
};

export const getCategoryTranslation = async (
    categoryId: string,
    language: string,
): Promise<CategoryTranslationResponse> => {
    await ensureCategoryExists(categoryId);

    const translation = await prisma.categoryTranslation.findUnique({
        where: {
            categoryId_language: {
                categoryId,
                language,
            },
        },
    });

    if (!translation) {
        throw new AppError(
            404,
            'CATEGORY_TRANSLATION_NOT_FOUND',
            'Category translation not found',
        );
    }

    return mapTranslation(translation);
};

export const upsertCategoryTranslation = async (
    categoryId: string,
    language: string,
    input: UpsertCategoryTranslationInput,
): Promise<CategoryTranslationResponse> => {
    await ensureCategoryExists(categoryId);

    const description =
        input.description === undefined ? undefined : input.description;

    const translation = await prisma.categoryTranslation.upsert({
        where: {
            categoryId_language: {
                categoryId,
                language,
            },
        },

        create: {
            categoryId,
            language,
            name: input.name,
            description: description ?? null,
        },

        update: {
            name: input.name,
            ...(description !== undefined
                ? {
                      description,
                  }
                : {}),
        },
    });

    return mapTranslation(translation);
};

export const deleteCategoryTranslation = async (
    categoryId: string,
    language: string,
): Promise<void> => {
    await ensureCategoryExists(categoryId);

    const translation = await prisma.categoryTranslation.findUnique({
        where: {
            categoryId_language: {
                categoryId,
                language,
            },
        },
        select: {
            id: true,
        },
    });

    if (!translation) {
        throw new AppError(
            404,
            'CATEGORY_TRANSLATION_NOT_FOUND',
            'Category translation not found',
        );
    }

    if (language === DEFAULT_LANGUAGE) {
        throw new AppError(
            400,
            'DEFAULT_TRANSLATION_REQUIRED',
            'The default category translation cannot be deleted',
        );
    }

    await prisma.categoryTranslation.delete({
        where: {
            id: translation.id,
        },
    });
};
