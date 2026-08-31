import type { Request, Response, NextFunction } from 'express';

import {
    categoryIdSchema,
    categorySlugSchema,
    createCategorySchema,
    updateCategorySchema,
} from './categories.schema';

import * as categoriesService from './categories.service';

export const getCategories = async (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const categories = await categoriesService.getCategories();

        res.json({
            success: true,
            categories,
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

        const category = await categoriesService.getCategoryBySlug(slug);

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
