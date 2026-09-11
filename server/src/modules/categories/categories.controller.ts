import type { Request, Response, NextFunction } from 'express';

import {
    categoryIdSchema,
    categoryLanguageQuerySchema,
    categorySlugSchema,
    createCategorySchema,
    updateCategorySchema,
} from './categories.schema';

import * as categoriesService from './categories.service';

export const getCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const query = categoryLanguageQuerySchema.parse(req.query);

        const result = await categoriesService.getCategories(query);

        res.json({
            success: true,
            categories: result.items,
        });
    } catch (error) {
        next(error);
    }
};

export const getCategoryBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { slug } = categorySlugSchema.parse(req.params);

        const { language } = categoryLanguageQuerySchema.parse(req.query);

        const category = await categoriesService.getCategoryBySlug(
            slug,
            language,
        );

        res.json({
            success: true,
            category,
        });
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const input = createCategorySchema.parse(req.body);

        const category = await categoriesService.createCategory(input);

        res.status(201).json({
            success: true,
            category,
        });
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = categoryIdSchema.parse(req.params);

        const input = updateCategorySchema.parse(req.body);

        const category = await categoriesService.updateCategory(id, input);

        res.json({
            success: true,
            category,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = categoryIdSchema.parse(req.params);

        await categoriesService.deleteCategory(id);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
