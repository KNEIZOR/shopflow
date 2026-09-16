import type { Request, Response, NextFunction } from 'express';

import {
    createProductVariantAttributeValueSchema,
    productVariantAttributeParamsSchema,
    productVariantAttributeProductParamsSchema,
    updateProductVariantAttributeValueSchema,
} from './product-variant-attributes.schema';

import * as attributeService from './services/product-variant-attributes.service';

export const getProductVariantAttributes = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, variantId } =
            productVariantAttributeProductParamsSchema.parse(req.params);

        const attributes = await attributeService.getProductVariantAttributes(
            productId,
            variantId,
        );

        res.json({
            success: true,
            attributes,
        });
    } catch (error) {
        next(error);
    }
};

export const createProductVariantAttribute = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, variantId } =
            productVariantAttributeProductParamsSchema.parse(req.params);

        const input = createProductVariantAttributeValueSchema.parse(req.body);

        const attribute = await attributeService.createProductVariantAttribute(
            productId,
            variantId,
            input,
        );

        res.status(201).json({
            success: true,
            attribute,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProductVariantAttribute = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, variantId, attributeId } =
            productVariantAttributeParamsSchema.parse(req.params);

        const input = updateProductVariantAttributeValueSchema.parse(req.body);

        const attribute = await attributeService.updateProductVariantAttribute(
            productId,
            variantId,
            attributeId,
            input,
        );

        res.json({
            success: true,
            attribute,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProductVariantAttribute = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, variantId, attributeId } =
            productVariantAttributeParamsSchema.parse(req.params);

        await attributeService.deleteProductVariantAttribute(
            productId,
            variantId,
            attributeId,
        );

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
