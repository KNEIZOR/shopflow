import Stripe from 'stripe';

import type { CurrencyCode } from '@prisma/client';

import { env } from '../../../config/env';
import { stripe as stripeClient } from '../../../lib/stripe';

import type { CheckoutLineItem } from '../payments.types';

export const stripe = stripeClient;

type CreateCheckoutSessionInput = {
    orderId: string;
    customerEmail: string;
    currency: CurrencyCode;
    lineItems: CheckoutLineItem[];
};

const toStripeCurrency = (currency: CurrencyCode): string => {
    return currency.toLowerCase();
};

export const createCheckoutSession = async ({
    orderId,
    customerEmail,
    currency,
    lineItems,
}: CreateCheckoutSessionInput): Promise<Stripe.Checkout.Session> => {
    return stripe.checkout.sessions.create(
        {
            mode: 'payment',

            customer_email: customerEmail,

            line_items: lineItems.map((item) => ({
                quantity: item.quantity,

                price_data: {
                    currency: toStripeCurrency(currency),

                    product_data: {
                        name: item.name,
                    },

                    unit_amount: item.unitAmount,
                },
            })),

            metadata: {
                orderId,
            },

            success_url: `${env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url: `${env.CLIENT_URL}/checkout/cancel`,

            payment_intent_data: {
                metadata: {
                    orderId,
                },
            },
        },
        {
            idempotencyKey: `shopflow-checkout-${orderId}`,
        },
    );
};
