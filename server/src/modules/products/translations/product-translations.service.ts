import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import type { UpsertProductTranslationInput } from './product-translations.schema';

import type {
    ProductTranslationResponse,
    ProductTranslationsResponse,
} from './product-translations.types';

const DEFAULT_LANGUAGE = 'ru';

type ProductTranslationRecord = {
    id: string;
    productId: string;
    language: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
};

const mapTranslation = (
    translation: ProductTranslationRecord,
): ProductTranslationResponse => {
    return {
        id: translation.id,
        productId: translation.productId,
        language: translation.language,
        name: translation.name,
        description: translation.description,
        createdAt: translation.createdAt,
        updatedAt: translation.updatedAt,
    };
};

const ensureProductExists = async (productId: string): Promise<void> => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
        },
    });

    if (!product) {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }
};

export const getProductTranslations = async (
    productId: string,
): Promise<ProductTranslationsResponse> => {
    await ensureProductExists(productId);

    const translations = await prisma.productTranslation.findMany({
        where: {
            productId,
        },
        orderBy: {
            language: 'asc',
        },
    });

    return {
        items: translations.map(mapTranslation),
    };
};

export const getProductTranslation = async (
    productId: string,
    language: string,
): Promise<ProductTranslationResponse> => {
    await ensureProductExists(productId);

    const translation = await prisma.productTranslation.findUnique({
        where: {
            productId_language: {
                productId,
                language,
            },
        },
    });

    if (!translation) {
        throw new AppError(
            404,
            'PRODUCT_TRANSLATION_NOT_FOUND',
            'Product translation not found',
        );
    }

    return mapTranslation(translation);
};

export const upsertProductTranslation = async (
    productId: string,
    language: string,
    input: UpsertProductTranslationInput,
): Promise<ProductTranslationResponse> => {
    await ensureProductExists(productId);

    const description =
        input.description === undefined ? undefined : input.description;

    const translation = await prisma.productTranslation.upsert({
        where: {
            productId_language: {
                productId,
                language,
            },
        },

        create: {
            productId,
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

export const deleteProductTranslation = async (
    productId: string,
    language: string,
): Promise<void> => {
    await ensureProductExists(productId);

    const translation = await prisma.productTranslation.findUnique({
        where: {
            productId_language: {
                productId,
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
            'PRODUCT_TRANSLATION_NOT_FOUND',
            'Product translation not found',
        );
    }

    if (language === DEFAULT_LANGUAGE) {
        throw new AppError(
            400,
            'DEFAULT_TRANSLATION_REQUIRED',
            'The default product translation cannot be deleted',
        );
    }

    await prisma.productTranslation.delete({
        where: {
            id: translation.id,
        },
    });
};
