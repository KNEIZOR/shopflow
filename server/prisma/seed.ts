import { PrismaClient } from '@prisma/client';

import { seedCategories } from './seed-categories';
import { seedProductTypes } from './seed-product-types';
import { seedProducts } from './seed-products';

const prisma = new PrismaClient();

const main = async () => {
    console.log('Starting ShopFlow seed...');

    const categoryMap = await seedCategories(prisma);

    console.log(`Categories: ${categoryMap.size}`);

    const productTypeMap = await seedProductTypes(prisma);

    console.log(`Product types: ${productTypeMap.size}`);

    await seedProducts(prisma, categoryMap, productTypeMap);

    console.log('ShopFlow seed completed successfully.');
};

main()
    .catch((error) => {
        console.error('ShopFlow seed failed:', error);

        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
