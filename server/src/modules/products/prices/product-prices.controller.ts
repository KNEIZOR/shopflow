import type { Request, Response, NextFunction } from 'express';

import {
    productPriceCurrencyParamsSchema,
    productPriceParamsSchema,
    upsertProductPriceSchema,
} from './product-prices.schema';

import * as productPricesService from './product-prices.service';

export const getProductPrices = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId } = productPriceParamsSchema.parse(req.params);

        const result = await productPricesService.getProductPrices(productId);

        res.json({
            success: true,
            prices: result.items,
        });
    } catch (error) {
        next(error);
    }
};

export const getProductPrice = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, currency } = productPriceCurrencyParamsSchema.parse(
            req.params,
        );

        const price = await productPricesService.getProductPrice(
            productId,
            currency,
        );

        res.json({
            success: true,
            price,
        });
    } catch (error) {
        next(error);
    }
};

export const upsertProductPrice = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, currency } = productPriceCurrencyParamsSchema.parse(
            req.params,
        );

        const input = upsertProductPriceSchema.parse(req.body);

        const price = await productPricesService.upsertProductPrice(
            productId,
            currency,
            input,
        );

        res.json({
            success: true,
            price,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProductPrice = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, currency } = productPriceCurrencyParamsSchema.parse(
            req.params,
        );

        await productPricesService.deleteProductPrice(productId, currency);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
