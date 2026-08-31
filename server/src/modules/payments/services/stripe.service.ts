import Stripe from 'stripe';

import { env } from '../../../config/env';
import { stripe as stripeClient } from '../../../lib/stripe';

export const stripe = stripeClient;

interface CheckoutLineItem {
    name: string;
    quantity: number;
    unitAmount: number;
}

interface CreateCheckoutSessionInput {
    orderId: string;
    customerEmail: string;
    lineItems: CheckoutLineItem[];
}

export const createCheckoutSession = async ({
    orderId,
    customerEmail,
    lineItems,
}: CreateCheckoutSessionInput): Promise<Stripe.Checkout.Session> => {
    return stripe.checkout.sessions.create({
        mode: 'payment',

        customer_email: customerEmail,

        line_items: lineItems.map((item) => ({
            quantity: item.quantity,

            price_data: {
                currency: 'eur',

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
    });
};
