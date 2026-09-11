import type { Request, Response, NextFunction } from 'express';

import {
    categoryTranslationLanguageParamsSchema,
    categoryTranslationParamsSchema,
    upsertCategoryTranslationSchema,
} from './category-translations.schema';

import * as categoryTranslationsService from './category-translations.service';

export const getCategoryTranslations = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { categoryId } = categoryTranslationParamsSchema.parse(
            req.params,
        );

        const result =
            await categoryTranslationsService.getCategoryTranslations(
                categoryId,
            );

        res.json({
            success: true,
            translations: result.items,
        });
    } catch (error) {
        next(error);
    }
};

export const getCategoryTranslation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { categoryId, language } =
            categoryTranslationLanguageParamsSchema.parse(req.params);

        const translation =
            await categoryTranslationsService.getCategoryTranslation(
                categoryId,
                language,
            );

        res.json({
            success: true,
            translation,
        });
    } catch (error) {
        next(error);
    }
};

export const upsertCategoryTranslation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { categoryId, language } =
            categoryTranslationLanguageParamsSchema.parse(req.params);

        const input = upsertCategoryTranslationSchema.parse(req.body);

        const translation =
            await categoryTranslationsService.upsertCategoryTranslation(
                categoryId,
                language,
                input,
            );

        res.json({
            success: true,
            translation,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCategoryTranslation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { categoryId, language } =
            categoryTranslationLanguageParamsSchema.parse(req.params);

        await categoryTranslationsService.deleteCategoryTranslation(
            categoryId,
            language,
        );

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
