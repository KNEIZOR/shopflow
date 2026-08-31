import type { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';

import { env } from '../../config/env';

import { createCheckout } from './services/checkout.service';
import { handleStripeWebhook } from './services/webhook.service';

import { stripe } from './services/stripe.service';

export const checkout = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.userId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            });

            return;
        }

        const { addressId } = req.body;

        if (typeof addressId !== 'string' || !addressId) {
            res.status(400).json({
                success: false,
                message: 'addressId is required',
            });

            return;
        }

        const result = await createCheckout(req.userId, addressId);

        res.status(201).json({
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

        if (!signature || typeof signature !== 'string') {
            res.status(400).json({
                success: false,
                message: 'Missing Stripe signature',
            });

            return;
        }

        if (!Buffer.isBuffer(req.body)) {
            res.status(400).json({
                success: false,
                message: 'Invalid Stripe webhook body',
            });

            return;
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                env.STRIPE_WEBHOOK_SECRET,
            );
        } catch {
            res.status(400).json({
                success: false,
                message: 'Invalid Stripe webhook signature',
            });

            return;
        }

        await handleStripeWebhook(event);

        res.status(200).json({
            received: true,
        });
    } catch (error) {
        next(error);
    }
};
