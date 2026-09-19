import Stripe from 'stripe';

import { AppError } from '../../../errors/app-error';
import { prisma } from '../../../lib/prisma';

const releaseOrderStock = async (orderId: string): Promise<void> => {
    await prisma.$transaction(async (tx) => {
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

        /*
         * Stock was reserved when the order was created.
         *
         * Never release stock from a paid order.
         * Never release it twice from an already cancelled order.
         */
        if (order.paymentStatus === 'PAID' || order.status === 'CANCELLED') {
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

        await tx.order.update({
            where: {
                id: order.id,
            },

            data: {
                status: 'CANCELLED',
            },
        });
    });
};

const removePurchasedItemsFromCart = async (
    userId: string,
    orderId: string,
): Promise<void> => {
    await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: {
                id: orderId,
            },

            select: {
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

        const cart = await tx.cart.findUnique({
            where: {
                userId,
            },

            select: {
                id: true,
            },
        });

        if (!cart) {
            return;
        }

        for (const orderItem of order.items) {
            const cartItem = await tx.cartItem.findUnique({
                where: {
                    cartId_variantId: {
                        cartId: cart.id,
                        variantId: orderItem.variantId,
                    },
                },

                select: {
                    id: true,
                    quantity: true,
                },
            });

            if (!cartItem) {
                continue;
            }

            if (cartItem.quantity <= orderItem.quantity) {
                await tx.cartItem.delete({
                    where: {
                        id: cartItem.id,
                    },
                });

                continue;
            }

            await tx.cartItem.update({
                where: {
                    id: cartItem.id,
                },

                data: {
                    quantity: {
                        decrement: orderItem.quantity,
                    },
                },
            });
        }
    });
};

export const handleStripeWebhook = async (
    event: Stripe.Event,
): Promise<void> => {
    switch (event.type) {
        case 'checkout.session.completed':
            await handleCheckoutSessionCompleted(
                event.data.object as Stripe.Checkout.Session,
            );
            return;

        case 'checkout.session.expired':
            await handleCheckoutSessionExpired(
                event.data.object as Stripe.Checkout.Session,
            );
            return;

        case 'payment_intent.payment_failed':
            await handlePaymentIntentFailed(
                event.data.object as Stripe.PaymentIntent,
            );
            return;

        default:
            return;
    }
};

const handleCheckoutSessionCompleted = async (
    session: Stripe.Checkout.Session,
): Promise<void> => {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
        throw new AppError(
            400,
            'STRIPE_ORDER_ID_MISSING',
            'Stripe checkout session does not contain order ID',
        );
    }

    if (session.payment_status !== 'paid') {
        return;
    }

    const paymentIntentId =
        typeof session.payment_intent === 'string'
            ? session.payment_intent
            : (session.payment_intent?.id ?? null);

    if (!paymentIntentId) {
        throw new AppError(
            400,
            'STRIPE_PAYMENT_INTENT_MISSING',
            'Stripe checkout session does not contain payment intent',
        );
    }

    let userId: string | null = null;

    await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: {
                id: orderId,
            },

            select: {
                id: true,
                userId: true,
                paymentSessionId: true,
                paymentIntentId: true,
                paymentStatus: true,
                status: true,
            },
        });

        if (!order) {
            throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
        }

        if (order.paymentSessionId && order.paymentSessionId !== session.id) {
            throw new AppError(
                409,
                'STRIPE_SESSION_MISMATCH',
                'Stripe session does not match the order',
            );
        }

        if (order.paymentStatus === 'PAID') {
            userId = order.userId;

            if (!order.paymentIntentId) {
                await tx.order.update({
                    where: {
                        id: order.id,
                    },

                    data: {
                        paymentIntentId,
                    },
                });
            }

            return;
        }

        const existingOrder = await tx.order.findFirst({
            where: {
                paymentIntentId,
                NOT: {
                    id: order.id,
                },
            },

            select: {
                id: true,
            },
        });

        if (existingOrder) {
            throw new AppError(
                409,
                'STRIPE_PAYMENT_INTENT_ALREADY_USED',
                'Stripe payment intent is already associated with another order',
            );
        }

        /*
         * Stock was already reserved when the order was created.
         *
         * Therefore the successful webhook must NOT decrement stock.
         */
        await tx.order.update({
            where: {
                id: order.id,
            },

            data: {
                paymentStatus: 'PAID',
                status: 'CONFIRMED',
                paymentIntentId,
            },
        });

        userId = order.userId;
    });

    if (userId) {
        await removePurchasedItemsFromCart(userId, orderId);
    }
};

const handleCheckoutSessionExpired = async (
    session: Stripe.Checkout.Session,
): Promise<void> => {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
        return;
    }

    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },

        select: {
            paymentStatus: true,
            status: true,
            paymentSessionId: true,
        },
    });

    if (!order) {
        return;
    }

    if (order.paymentSessionId && order.paymentSessionId !== session.id) {
        return;
    }

    if (order.paymentStatus === 'PAID' || order.status === 'CANCELLED') {
        return;
    }

    await releaseOrderStock(orderId);
};

const handlePaymentIntentFailed = async (
    paymentIntent: Stripe.PaymentIntent,
): Promise<void> => {
    const orderId = paymentIntent.metadata?.orderId;

    let order = null;

    if (orderId) {
        order = await prisma.order.findUnique({
            where: {
                id: orderId,
            },

            select: {
                id: true,
                paymentStatus: true,
                paymentIntentId: true,
            },
        });
    }

    if (!order) {
        order = await prisma.order.findUnique({
            where: {
                paymentIntentId: paymentIntent.id,
            },

            select: {
                id: true,
                paymentStatus: true,
                paymentIntentId: true,
            },
        });
    }

    if (!order) {
        return;
    }

    if (order.paymentStatus === 'PAID') {
        return;
    }

    /*
     * Do not release stock here.
     *
     * Stripe Checkout may allow another payment attempt.
     * The stock reservation will be released by
     * checkout.session.expired if the session is never paid.
     */
    await prisma.order.update({
        where: {
            id: order.id,
        },

        data: {
            paymentStatus: 'FAILED',
            paymentIntentId: paymentIntent.id,
        },
    });
};
