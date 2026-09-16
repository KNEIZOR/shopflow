import type { Request, Response, NextFunction } from 'express';

import {
    createProductTypeAttributeSchema,
    createProductTypeOptionSchema,
    createProductTypeSchema,
    productTypeAttributeIdSchema,
    productTypeIdSchema,
    productTypeOptionIdSchema,
    productTypeSlugSchema,
    updateProductTypeAttributeSchema,
    updateProductTypeOptionSchema,
    updateProductTypeSchema,
} from './product-types.schema';

import * as productTypesService from './product-types.service';

import * as productTypeAttributesService from './services/product-type-attributes.service';

import * as productTypeOptionsService from './services/product-type-options.service';

/**
 * Product types
 */

export const getProductTypes = async (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await productTypesService.getProductTypes();

        res.json({
            success: true,
            productTypes: result.items,
        });
    } catch (error) {
        next(error);
    }
};

export const getProductTypeBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { slug } = productTypeSlugSchema.parse(req.params);

        const productType =
            await productTypesService.getProductTypeBySlug(slug);

        res.json({
            success: true,
            productType,
        });
    } catch (error) {
        next(error);
    }
};

export const getProductTypeById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = productTypeIdSchema.parse(req.params);

        const productType = await productTypesService.getProductTypeById(id);

        res.json({
            success: true,
            productType,
        });
    } catch (error) {
        next(error);
    }
};

export const createProductType = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const input = createProductTypeSchema.parse(req.body);

        const productType = await productTypesService.createProductType(input);

        res.status(201).json({
            success: true,
            productType,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProductType = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = productTypeIdSchema.parse(req.params);

        const input = updateProductTypeSchema.parse(req.body);

        const productType = await productTypesService.updateProductType(
            id,
            input,
        );

        res.json({
            success: true,
            productType,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProductType = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = productTypeIdSchema.parse(req.params);

        await productTypesService.deleteProductType(id);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

/**
 * Product type attributes
 */

export const getProductTypeAttributes = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = productTypeIdSchema.parse(req.params);

        const attributes =
            await productTypeAttributesService.getProductTypeAttributes(id);

        res.json({
            success: true,
            attributes,
        });
    } catch (error) {
        next(error);
    }
};

export const getProductTypeAttributeById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = productTypeIdSchema.parse(req.params);

        const { attributeId } = productTypeAttributeIdSchema.parse(req.params);

        const attribute =
            await productTypeAttributesService.getProductTypeAttributeById(
                id,
                attributeId,
            );

        res.json({
            success: true,
            attribute,
        });
    } catch (error) {
        next(error);
    }
};

export const createProductTypeAttribute = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = productTypeIdSchema.parse(req.params);

        const input = createProductTypeAttributeSchema.parse(req.body);

        const attribute =
            await productTypeAttributesService.createProductTypeAttribute(
                id,
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

export const updateProductTypeAttribute = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = productTypeIdSchema.parse(req.params);

        const { attributeId } = productTypeAttributeIdSchema.parse(req.params);

        const input = updateProductTypeAttributeSchema.parse(req.body);

        const attribute =
            await productTypeAttributesService.updateProductTypeAttribute(
                id,
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

export const deleteProductTypeAttribute = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = productTypeIdSchema.parse(req.params);

        const { attributeId } = productTypeAttributeIdSchema.parse(req.params);

        await productTypeAttributesService.deleteProductTypeAttribute(
            id,
            attributeId,
        );

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

/**
 * Product type attribute options
 */

export const getProductTypeOptions = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = productTypeIdSchema.parse(req.params);

        const { attributeId } = productTypeAttributeIdSchema.parse(req.params);

        const options = await productTypeOptionsService.getProductTypeOptions(
            id,
            attributeId,
        );

        res.json({
            success: true,
            options,
        });
    } catch (error) {
        next(error);
    }
};

export const getProductTypeOptionById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = productTypeIdSchema.parse(req.params);

        const { attributeId } = productTypeAttributeIdSchema.parse(req.params);

        const { optionId } = productTypeOptionIdSchema.parse(req.params);

        const option = await productTypeOptionsService.getProductTypeOptionById(
            id,
            attributeId,
            optionId,
        );

        res.json({
            success: true,
            option,
        });
    } catch (error) {
        next(error);
    }
};

export const createProductTypeOption = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = productTypeIdSchema.parse(req.params);

        const { attributeId } = productTypeAttributeIdSchema.parse(req.params);

        const input = createProductTypeOptionSchema.parse(req.body);

        const option = await productTypeOptionsService.createProductTypeOption(
            id,
            attributeId,
            input,
        );

        res.status(201).json({
            success: true,
            option,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProductTypeOption = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = productTypeIdSchema.parse(req.params);

        const { attributeId } = productTypeAttributeIdSchema.parse(req.params);

        const { optionId } = productTypeOptionIdSchema.parse(req.params);

        const input = updateProductTypeOptionSchema.parse(req.body);

        const option = await productTypeOptionsService.updateProductTypeOption(
            id,
            attributeId,
            optionId,
            input,
        );

        res.json({
            success: true,
            option,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProductTypeOption = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = productTypeIdSchema.parse(req.params);

        const { attributeId } = productTypeAttributeIdSchema.parse(req.params);

        const { optionId } = productTypeOptionIdSchema.parse(req.params);

        await productTypeOptionsService.deleteProductTypeOption(
            id,
            attributeId,
            optionId,
        );

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
