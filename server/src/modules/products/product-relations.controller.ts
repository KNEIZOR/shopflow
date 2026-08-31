import type { Request, Response, NextFunction } from 'express';

import {
    createProductImageSchema,
    createProductVariantSchema,
    productImageParamsSchema,
    productVariantParamsSchema,
    updateProductImageSchema,
    updateProductVariantSchema,
} from './products.schema';

import * as imageService from './services/product-images.service';
import * as variantService from './services/product-variants.service';

export const getProductImages = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId } = productImageParamsSchema
            .pick({
                productId: true,
            })
            .parse(req.params);

        const images = await imageService.getProductImages(productId);

        res.json({
            success: true,
            images,
        });
    } catch (error) {
        next(error);
    }
};

export const addProductImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId } = productImageParamsSchema
            .pick({
                productId: true,
            })
            .parse(req.params);

        const input = createProductImageSchema.parse(req.body);

        const image = await imageService.addProductImage(productId, input);

        res.status(201).json({
            success: true,
            image,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProductImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, imageId } = productImageParamsSchema.parse(
            req.params,
        );

        const input = updateProductImageSchema.parse(req.body);

        const image = await imageService.updateProductImage(
            productId,
            imageId,
            input,
        );

        res.json({
            success: true,
            image,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProductImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, imageId } = productImageParamsSchema.parse(
            req.params,
        );

        await imageService.deleteProductImage(productId, imageId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const getProductVariants = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId } = productVariantParamsSchema
            .pick({
                productId: true,
            })
            .parse(req.params);

        const variants = await variantService.getProductVariants(productId);

        res.json({
            success: true,
            variants,
        });
    } catch (error) {
        next(error);
    }
};

export const addProductVariant = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId } = productVariantParamsSchema
            .pick({
                productId: true,
            })
            .parse(req.params);

        const input = createProductVariantSchema.parse(req.body);

        const variant = await variantService.addProductVariant(
            productId,
            input,
        );

        res.status(201).json({
            success: true,
            variant,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProductVariant = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, variantId } = productVariantParamsSchema.parse(
            req.params,
        );

        const input = updateProductVariantSchema.parse(req.body);

        const variant = await variantService.updateProductVariant(
            productId,
            variantId,
            input,
        );

        res.json({
            success: true,
            variant,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProductVariant = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, variantId } = productVariantParamsSchema.parse(
            req.params,
        );

        await variantService.deleteProductVariant(productId, variantId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
