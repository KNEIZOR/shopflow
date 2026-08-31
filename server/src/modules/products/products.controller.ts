import type { Request, Response, NextFunction } from 'express';

import {
    createProductSchema,
    productIdSchema,
    productListQuerySchema,
    productSlugSchema,
    updateProductSchema,
} from './products.schema';

import * as productsService from './products.service';

export const getProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const query = productListQuerySchema.parse(req.query);

        const products = await productsService.getProducts(query);

        res.json({
            success: true,
            ...products,
        });
    } catch (error) {
        next(error);
    }
};

export const getProductBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { slug } = productSlugSchema.parse(req.params);

        const product = await productsService.getProductBySlug(slug);

        res.json({
            success: true,
            product,
        });
    } catch (error) {
        next(error);
    }
};

export const getAdminProductBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { slug } = productSlugSchema.parse(req.params);

        const product = await productsService.getProductBySlug(slug, true);

        res.json({
            success: true,
            product,
        });
    } catch (error) {
        next(error);
    }
};

export const getAdminProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const query = productListQuerySchema.parse(req.query);

        const products = await productsService.getProducts(query, true);

        res.json({
            success: true,
            ...products,
        });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const input = createProductSchema.parse(req.body);

        const product = await productsService.createProduct(input);

        res.status(201).json({
            success: true,
            product,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = productIdSchema.parse(req.params);

        const input = updateProductSchema.parse(req.body);

        const product = await productsService.updateProduct(id, input);

        res.json({
            success: true,
            product,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = productIdSchema.parse(req.params);

        await productsService.deleteProduct(id);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
