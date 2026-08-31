import app from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

const startServer = async () => {
    try {
        await prisma.$connect();

        app.listen(env.PORT, () => {
            console.log(`ShopFlow API running on http://localhost:${env.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

startServer();
