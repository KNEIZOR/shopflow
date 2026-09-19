import type { NextFunction, Request, Response } from 'express';
import Stripe from 'stripe';

import { env } from '../../config/env';
import { AppError } from '../../errors/app-error';

import { createCheckoutSchema } from './payments.schema';
import { createCheckout } from './services/checkout.service';
import { stripe, createCheckoutSession } from './services/stripe.service';
import { handleStripeWebhook } from './services/webhook.service';

const getAuthenticatedUserId = (req: Request): string => {
    if (!req.userId) {
        throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    return req.userId;
};

export const checkout = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const input = createCheckoutSchema.parse(req.body);

        const result = await createCheckout(userId, input);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const webhook = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const signature = req.headers['stripe-signature'];

        if (typeof signature !== 'string' || signature.length === 0) {
            throw new AppError(
                400,
                'STRIPE_SIGNATURE_MISSING',
                'Stripe signature is missing',
            );
        }

        if (!Buffer.isBuffer(req.body)) {
            throw new AppError(
                400,
                'STRIPE_RAW_BODY_REQUIRED',
                'Stripe webhook requires a raw request body',
            );
        }

        const event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            env.STRIPE_WEBHOOK_SECRET,
        );

        await handleStripeWebhook(event);

        res.status(200).json({
            received: true,
        });
    } catch (error) {
        if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
            next(
                new AppError(
                    400,
                    'STRIPE_SIGNATURE_INVALID',
                    'Invalid Stripe webhook signature',
                ),
            );

            return;
        }

        next(error);
    }
};
