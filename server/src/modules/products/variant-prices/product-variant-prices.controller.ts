import type { Request, Response, NextFunction } from 'express';

import {
    productVariantPriceCurrencyParamsSchema,
    productVariantPriceParamsSchema,
    upsertProductVariantPriceSchema,
} from './product-variant-prices.schema';

import * as productVariantPricesService from './product-variant-prices.service';

export const getProductVariantPrices = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, variantId } = productVariantPriceParamsSchema.parse(
            req.params,
        );

        const result =
            await productVariantPricesService.getProductVariantPrices(
                productId,
                variantId,
            );

        res.json({
            success: true,
            prices: result.items,
        });
    } catch (error) {
        next(error);
    }
};

export const getProductVariantPrice = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, variantId, currency } =
            productVariantPriceCurrencyParamsSchema.parse(req.params);

        const price = await productVariantPricesService.getProductVariantPrice(
            productId,
            variantId,
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

export const upsertProductVariantPrice = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, variantId, currency } =
            productVariantPriceCurrencyParamsSchema.parse(req.params);

        const input = upsertProductVariantPriceSchema.parse(req.body);

        const price =
            await productVariantPricesService.upsertProductVariantPrice(
                productId,
                variantId,
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

export const deleteProductVariantPrice = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, variantId, currency } =
            productVariantPriceCurrencyParamsSchema.parse(req.params);

        await productVariantPricesService.deleteProductVariantPrice(
            productId,
            variantId,
            currency,
        );

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
