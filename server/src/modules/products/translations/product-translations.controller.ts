import type { Request, Response, NextFunction } from 'express';

import {
    productTranslationLanguageParamsSchema,
    productTranslationParamsSchema,
    upsertProductTranslationSchema,
} from './product-translations.schema';

import * as productTranslationsService from './product-translations.service';

export const getProductTranslations = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId } = productTranslationParamsSchema.parse(req.params);

        const result =
            await productTranslationsService.getProductTranslations(productId);

        res.json({
            success: true,
            translations: result.items,
        });
    } catch (error) {
        next(error);
    }
};

export const getProductTranslation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, language } =
            productTranslationLanguageParamsSchema.parse(req.params);

        const translation =
            await productTranslationsService.getProductTranslation(
                productId,
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

export const upsertProductTranslation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, language } =
            productTranslationLanguageParamsSchema.parse(req.params);

        const input = upsertProductTranslationSchema.parse(req.body);

        const translation =
            await productTranslationsService.upsertProductTranslation(
                productId,
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

export const deleteProductTranslation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, language } =
            productTranslationLanguageParamsSchema.parse(req.params);

        await productTranslationsService.deleteProductTranslation(
            productId,
            language,
        );

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
