import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './config/env';

import healthRouter from './routes/health.routes';
import authRouter from './modules/auth/auth.routes';
import categoriesRouter from './modules/categories/categories.routes';
import productsRouter from './modules/products/products.routes';

import { errorHandler } from './middleware/error';

const app = express();

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
    }),
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
app.use('/api/products', productsRouter);

app.use(errorHandler);

export default app;
