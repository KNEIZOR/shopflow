import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './config/env';

import healthRouter from './routes/health.routes';
import authRouter from './modules/auth/auth.routes';
import categoriesRouter from './modules/categories/categories.routes';
import productTypesRouter from './modules/product-types/product-types.routes';
import productsRouter from './modules/products/products.routes';
import addressesRouter from './modules/addresses/address.routes';
import cartRoutes from './modules/cart/cart.routes';
import orderRoutes from './modules/orders/order.routes';
import paymentsRoutes from './modules/payments/payments.routes';

import { webhook } from './modules/payments/payments.controller';

import { errorHandler } from './middleware/error';

const app = express();

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
    }),
);

/*
 * Stripe webhook MUST receive the raw request body.
 *
 * This route has to be registered BEFORE express.json().
 */
app.post(
    '/api/payments/webhook',
    express.raw({
        type: 'application/json',
    }),
    webhook,
);

app.use(express.json());
app.use(cookieParser());

app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'ShopFlow API',
    });
});

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/product-types', productTypesRouter);
app.use('/api/products', productsRouter);
app.use('/api/addresses', addressesRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentsRoutes);

app.use(errorHandler);

export default app;
