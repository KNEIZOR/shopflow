import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),

    PORT: z.coerce.number().int().positive().default(5000),

    DATABASE_URL: z.string().min(1),

    CLIENT_URL: z.string().url(),

    JWT_SECRET: z.string().min(32),

    JWT_EXPIRES_IN: z.string().default('7d'),

    STRIPE_SECRET_KEY: z.string().min(1),

    STRIPE_WEBHOOK_SECRET: z.string().min(1),
});

export const env = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    CLIENT_URL: process.env.CLIENT_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
});
