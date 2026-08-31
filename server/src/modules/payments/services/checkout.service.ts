import { Prisma } from '@prisma/client';

import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

import { createCheckoutSession } from './stripe.service';

const MAX_CART_ITEM_QUANTITY = 100;

export const createCheckout = async (userId: string, addressId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            email: true,
        },
    });

    if (!user) {
        throw new AppError(401, 'UNAUTHORIZED', 'User not found');
    }

    const address = await prisma.address.findFirst({
        where: {
            id: addressId,
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!address) {
        throw new AppError(404, 'ADDRESS_NOT_FOUND', 'Address not found');
    }

    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            status: true,
                        },
                    },

                    variant: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            stock: true,
                        },
                    },
                },
            },
        },
    });

    if (!cart || cart.items.length === 0) {
        throw new AppError(400, 'CART_EMPTY', 'Cart is empty');
    }

    for (const item of cart.items) {
        if (
            !Number.isInteger(item.quantity) ||
            item.quantity <= 0 ||
            item.quantity > MAX_CART_ITEM_QUANTITY
        ) {
            throw new AppError(
                400,
                'INVALID_CART_QUANTITY',
                'Invalid cart quantity',
            );
        }

        if (item.product.status !== 'ACTIVE') {
            throw new AppError(
                400,
                'PRODUCT_UNAVAILABLE',
                `Product "${item.product.name}" is unavailable`,
            );
        }

        if (item.variant.stock < item.quantity) {
            throw new AppError(
                400,
                'INSUFFICIENT_STOCK',
                `Insufficient stock for "${item.product.name}"`,
            );
        }

        if (item.variant.price === null) {
            throw new AppError(
                400,
                'PRODUCT_PRICE_NOT_SET',
                `Price is not set for "${item.product.name}"`,
            );
        }

        if (item.variant.price.lessThanOrEqualTo(0)) {
            throw new AppError(
                400,
                'INVALID_PRODUCT_PRICE',
                `Invalid price for "${item.product.name}"`,
            );
        }
    }

    const orderTotal = cart.items.reduce((total, item) => {
        if (item.variant.price === null) {
            throw new AppError(
                400,
                'PRODUCT_PRICE_NOT_SET',
                `Price is not set for "${item.product.name}"`,
            );
        }

        return total.add(item.variant.price.mul(item.quantity));
    }, new Prisma.Decimal(0));

    const order = await prisma.order.create({
        data: {
            userId: user.id,
            addressId: address.id,
            total: orderTotal,
            paymentProvider: 'stripe',

            items: {
                create: cart.items.map((item) => {
                    if (item.variant.price === null) {
                        throw new AppError(
                            400,
                            'PRODUCT_PRICE_NOT_SET',
                            `Price is not set for "${item.product.name}"`,
                        );
                    }

                    return {
                        productId: item.product.id,
                        variantId: item.variant.id,
                        quantity: item.quantity,
                        price: item.variant.price,
                    };
                }),
            },
        },

        select: {
            id: true,
        },
    });

    try {
        const session = await createCheckoutSession({
            orderId: order.id,
            customerEmail: user.email,

            lineItems: cart.items.map((item) => {
                if (item.variant.price === null) {
                    throw new AppError(
                        400,
                        'PRODUCT_PRICE_NOT_SET',
                        `Price is not set for "${item.product.name}"`,
                    );
                }

                return {
                    name: `${item.product.name} — ${item.variant.name}`,
                    quantity: item.quantity,
                    unitAmount: item.variant.price.mul(100).toNumber(),
                };
            }),
        });

        if (!session.url) {
            throw new AppError(
                502,
                'STRIPE_CHECKOUT_URL_MISSING',
                'Stripe checkout URL was not created',
            );
        }

        await prisma.order.update({
            where: {
                id: order.id,
            },

            data: {
                paymentSessionId: session.id,

                paymentIntentId:
                    typeof session.payment_intent === 'string'
                        ? session.payment_intent
                        : undefined,
            },
        });

        return {
            orderId: order.id,
            checkoutUrl: session.url,
        };
    } catch (error) {
        await prisma.order.delete({
            where: {
                id: order.id,
            },
        });

        throw error;
    }
};
