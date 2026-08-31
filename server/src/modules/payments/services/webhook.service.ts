import Stripe from 'stripe';

import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

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

    /*
     * Stripe normally returns the PaymentIntent ID as a string.
     *
     * It can also be null, for example if the Checkout Session
     * was created without a PaymentIntent.
     *
     * Our Checkout flow uses mode: "payment", so a PaymentIntent
     * should normally exist.
     */
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

    await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: {
                id: orderId,
            },
            include: {
                items: {
                    select: {
                        productId: true,
                        variantId: true,
                        quantity: true,
                    },
                },
            },
        });

        if (!order) {
            throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
        }

        /*
         * The webhook must belong to the Checkout Session
         * that was created for this order.
         */
        if (order.paymentSessionId && order.paymentSessionId !== session.id) {
            throw new AppError(
                409,
                'STRIPE_SESSION_MISMATCH',
                'Stripe session does not match the order',
            );
        }

        /*
         * If the order is already paid, Stripe may simply be
         * retrying the same webhook.
         *
         * We must NOT decrease stock twice.
         */
        if (order.paymentStatus === 'PAID') {
            /*
             * Make sure paymentIntentId is stored even if the
             * order was marked as paid by an earlier implementation.
             */
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

        /*
         * Make sure the PaymentIntent isn't already associated
         * with another order.
         */
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
         * Decrease stock for the exact ProductVariant that
         * was purchased.
         */
        for (const item of order.items) {
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
                    'INSUFFICIENT_STOCK',
                    'Product stock is no longer available',
                );
            }
        }

        /*
         * Mark the order as successfully paid and save
         * the Stripe PaymentIntent ID.
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

        /*
         * Payment succeeded, so the user's cart can be cleared.
         */
        await tx.cartItem.deleteMany({
            where: {
                cart: {
                    userId: order.userId,
                },
            },
        });
    });
};

const handleCheckoutSessionExpired = async (
    session: Stripe.Checkout.Session,
): Promise<void> => {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
        return;
    }

    await prisma.order.updateMany({
        where: {
            id: orderId,
            paymentStatus: 'PENDING',
            status: 'PENDING',
        },
        data: {
            status: 'CANCELLED',
        },
    });
};

const handlePaymentIntentFailed = async (
    paymentIntent: Stripe.PaymentIntent,
): Promise<void> => {
    /*
     * The PaymentIntent metadata contains the internal Order ID.
     *
     * This is more reliable than searching by paymentIntentId,
     * especially because paymentIntentId may not yet have been
     * persisted if the payment fails very early.
     */
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

    /*
     * Fallback: if metadata is missing, try to find the order
     * by the PaymentIntent ID.
     */
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

    /*
     * A paid order must never be changed back to FAILED.
     */
    if (order.paymentStatus === 'PAID') {
        return;
    }

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
