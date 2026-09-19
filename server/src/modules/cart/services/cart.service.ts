import { Prisma, type CurrencyCode } from '@prisma/client';

import { AppError } from '../../../errors/app-error';

import { getCartByUserId } from './cart-query.service';

const getVariantPrice = (
    item: Awaited<ReturnType<typeof getCartByUserId>> extends infer T
        ? T extends { items: Array<infer I> }
            ? I
            : never
        : never,
    currency: CurrencyCode,
): Prisma.Decimal => {
    const currencyPrice = item.variant.prices.find(
        (price) => price.currency === currency,
    );

    if (currencyPrice) {
        return currencyPrice.amount;
    }

    if (currency === 'RUB' && item.variant.price !== null) {
        return item.variant.price;
    }

    throw new AppError(
        400,
        'PRODUCT_PRICE_NOT_AVAILABLE',
        `Price is not available in ${currency} for product "${item.product.name}"`,
    );
};

export const getUserCart = async (
    userId: string,
    currency: CurrencyCode = 'RUB',
) => {
    const cart = await getCartByUserId(userId);

    if (!cart) {
        return {
            id: null,

            items: [],

            summary: {
                itemsCount: 0,
                subtotal: '0.00',
                currency,
            },
        };
    }

    let itemsCount = 0;
    let subtotal = new Prisma.Decimal(0);

    const items = cart.items.map((item) => {
        const price = getVariantPrice(item, currency);

        const itemSubtotal = price.mul(item.quantity);

        itemsCount += item.quantity;

        return {
            id: item.id,

            quantity: item.quantity,

            product: {
                id: item.product.id,
                name: item.product.name,
                slug: item.product.slug,

                image: item.product.images[0]
                    ? {
                          id: item.product.images[0].id,
                          url: item.product.images[0].url,
                          alt: item.product.images[0].alt,
                      }
                    : null,
            },

            variant: {
                id: item.variant.id,
                name: item.variant.name,
                sku: item.variant.sku,

                price: price.toFixed(2),

                stock: item.variant.stock,
            },

            subtotal: itemSubtotal.toFixed(2),
        };
    });

    subtotal = items.reduce(
        (total, item) => total.add(new Prisma.Decimal(item.subtotal)),
        subtotal,
    );

    return {
        id: cart.id,

        items,

        summary: {
            itemsCount,

            subtotal: subtotal.toFixed(2),

            currency,
        },
    };
};
