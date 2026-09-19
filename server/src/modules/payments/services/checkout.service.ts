import { Prisma, type CurrencyCode } from '@prisma/client';

import { AppError } from '../../../errors/app-error';
import { prisma } from '../../../lib/prisma';

import type {
    CreateCheckoutInput,
    CreateCheckoutResult,
} from '../payments.types';

import { createCheckoutSession } from './stripe.service';

const MAX_CART_ITEM_QUANTITY = 100;

type CheckoutCartItem = {
    productId: string;
    productName: string;
    variantId: string;
    variantName: string;
    quantity: number;
    price: Prisma.Decimal;
};

const toStripeUnitAmount = (price: Prisma.Decimal): number => {
    const amountInMinorUnits = price.mul(100);

    if (!amountInMinorUnits.isInteger()) {
        throw new AppError(
            400,
            'INVALID_PRODUCT_PRICE',
            'Product price has invalid precision',
        );
    }

    const value = amountInMinorUnits.toNumber();

    if (!Number.isSafeInteger(value) || value <= 0) {
        throw new AppError(
            400,
            'INVALID_PRODUCT_PRICE',
            'Product price is outside the supported payment range',
        );
    }

    return value;
};

const validateCurrency = (currency: CurrencyCode): void => {
    const supportedCurrencies: CurrencyCode[] = ['RUB', 'EUR', 'USD', 'AMD'];

    if (!supportedCurrencies.includes(currency)) {
        throw new AppError(
            400,
            'UNSUPPORTED_CURRENCY',
            'Unsupported checkout currency',
        );
    }
};

const reserveStockAndCreateOrder = async (
    userId: string,
    addressId: string,
    currency: CurrencyCode,
): Promise<{
    orderId: string;
    customerEmail: string;
    items: CheckoutCartItem[];
}> => {
    return prisma.$transaction(
        async (tx) => {
            const user = await tx.user.findUnique({
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

            const address = await tx.address.findFirst({
                where: {
                    id: addressId,
                    userId,
                },

                select: {
                    id: true,
                },
            });

            if (!address) {
                throw new AppError(
                    404,
                    'ADDRESS_NOT_FOUND',
                    'Address not found',
                );
            }

            const cart = await tx.cart.findUnique({
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
                                    stock: true,

                                    prices: {
                                        where: {
                                            currency,
                                        },

                                        select: {
                                            amount: true,
                                        },

                                        take: 1,
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!cart || cart.items.length === 0) {
                throw new AppError(400, 'CART_EMPTY', 'Cart is empty');
            }

            const checkoutItems: CheckoutCartItem[] = [];

            let orderTotal = new Prisma.Decimal(0);

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

                const variantPrice = item.variant.prices[0]?.amount;

                if (!variantPrice) {
                    throw new AppError(
                        400,
                        'PRODUCT_PRICE_NOT_SET',
                        `Price is not set for "${item.product.name}" in ${currency}`,
                    );
                }

                if (variantPrice.lessThanOrEqualTo(0)) {
                    throw new AppError(
                        400,
                        'INVALID_PRODUCT_PRICE',
                        `Invalid price for "${item.product.name}"`,
                    );
                }

                orderTotal = orderTotal.add(variantPrice.mul(item.quantity));

                checkoutItems.push({
                    productId: item.product.id,
                    productName: item.product.name,
                    variantId: item.variant.id,
                    variantName: item.variant.name,
                    quantity: item.quantity,
                    price: variantPrice,
                });
            }

            if (orderTotal.lessThanOrEqualTo(0)) {
                throw new AppError(
                    400,
                    'INVALID_ORDER_TOTAL',
                    'Order total must be greater than zero',
                );
            }

            /*
             * Reserve stock before creating the Stripe session.
             *
             * The stock reservation is atomic and protected by
             * "stock >= quantity", so two concurrent checkouts
             * cannot reserve the same units.
             */
            for (const item of checkoutItems) {
                const updated = await tx.productVariant.updateMany({
                    where: {
                        id: item.variantId,
                        stock: {
                            gte: item.quantity,
                        },
                    },

                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });

                if (updated.count !== 1) {
                    throw new AppError(
                        409,
                        'STOCK_CHANGED',
                        'Product stock changed while creating the order',
                    );
                }
            }

            const order = await tx.order.create({
                data: {
                    userId,
                    addressId: address.id,
                    total: orderTotal,
                    currency,
                    status: 'PENDING',
                    paymentStatus: 'PENDING',
                    paymentProvider: 'stripe',

                    items: {
                        create: checkoutItems.map((item) => ({
                            productId: item.productId,
                            variantId: item.variantId,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },

                select: {
                    id: true,
                },
            });

            return {
                orderId: order.id,
                customerEmail: user.email,
                items: checkoutItems,
            };
        },
        {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
    );
};

const releaseReservedStock = async (orderId: string): Promise<void> => {
    await prisma.$transaction(
        async (tx) => {
            const order = await tx.order.findUnique({
                where: {
                    id: orderId,
                },

                include: {
                    items: {
                        select: {
                            variantId: true,
                            quantity: true,
                        },
                    },
                },
            });

            if (!order) {
                return;
            }

            if (order.paymentStatus === 'PAID' || order.status !== 'PENDING') {
                return;
            }

            for (const item of order.items) {
                await tx.productVariant.update({
                    where: {
                        id: item.variantId,
                    },

                    data: {
                        stock: {
                            increment: item.quantity,
                        },
                    },
                });
            }

            await tx.order.delete({
                where: {
                    id: order.id,
                },
            });
        },
        {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
    );
};

export const createCheckout = async (
    userId: string,
    input: CreateCheckoutInput,
): Promise<CreateCheckoutResult> => {
    const currency = input.currency as CurrencyCode;

    validateCurrency(currency);

    const { orderId, customerEmail, items } = await reserveStockAndCreateOrder(
        userId,
        input.addressId,
        currency,
    );

    try {
        const session = await createCheckoutSession({
            orderId,
            customerEmail,
            currency,

            lineItems: items.map((item) => ({
                name: `${item.productName} — ${item.variantName}`,
                quantity: item.quantity,
                unitAmount: toStripeUnitAmount(item.price),
            })),
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
                id: orderId,
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
            orderId,
            checkoutUrl: session.url,
        };
    } catch (error) {
        await releaseReservedStock(orderId);

        throw error;
    }
};
