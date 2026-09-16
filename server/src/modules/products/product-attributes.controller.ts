import type { Request, Response, NextFunction } from 'express';

import {
    createProductAttributeValueSchema,
    productAttributeParamsSchema,
    updateProductAttributeValueSchema,
} from './product-attributes.schema';

import * as attributeService from './services/product-attributes.service';

export const getProductAttributes = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId } = productAttributeParamsSchema
            .pick({
                productId: true,
            })
            .parse(req.params);

        const attributes =
            await attributeService.getProductAttributes(productId);

        res.json({
            success: true,
            attributes,
        });
    } catch (error) {
        next(error);
    }
};

export const createProductAttribute = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId } = productAttributeParamsSchema
            .pick({
                productId: true,
            })
            .parse(req.params);

        const input = createProductAttributeValueSchema.parse(req.body);

        const attribute = await attributeService.createProductAttribute(
            productId,
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

export const updateProductAttribute = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, attributeId } = productAttributeParamsSchema.parse(
            req.params,
        );

        const input = updateProductAttributeValueSchema.parse(req.body);

        const attribute = await attributeService.updateProductAttribute(
            productId,
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

export const deleteProductAttribute = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, attributeId } = productAttributeParamsSchema.parse(
            req.params,
        );

        await attributeService.deleteProductAttribute(productId, attributeId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
