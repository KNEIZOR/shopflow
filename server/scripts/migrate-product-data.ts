import { PrismaClient, CurrencyCode } from '@prisma/client';

const prisma = new PrismaClient();

const BASE_LANGUAGE = 'ru';
const BASE_CURRENCY: CurrencyCode = 'RUB';
const BASE_PRICE = '2599.00';

const migrateProductData = async (): Promise<void> => {
    console.log('Starting product data migration...');

    const products = await prisma.product.findMany({
        include: {
            category: true,
            variants: true,
        },
    });

    console.log(`Found ${products.length} product(s).`);

    for (const product of products) {
        await prisma.productTranslation.upsert({
            where: {
                productId_language: {
                    productId: product.id,
                    language: BASE_LANGUAGE,
                },
            },
            update: {
                name: product.name,
                description: product.description,
            },
            create: {
                productId: product.id,
                language: BASE_LANGUAGE,
                name: product.name,
                description: product.description,
            },
        });

        await prisma.productPrice.upsert({
            where: {
                productId_currency: {
                    productId: product.id,
                    currency: BASE_CURRENCY,
                },
            },
            update: {
                amount: BASE_PRICE,
            },
            create: {
                productId: product.id,
                currency: BASE_CURRENCY,
                amount: BASE_PRICE,
            },
        });

        await prisma.categoryTranslation.upsert({
            where: {
                categoryId_language: {
                    categoryId: product.category.id,
                    language: BASE_LANGUAGE,
                },
            },
            update: {
                name: product.category.name,
                description: product.category.description,
            },
            create: {
                categoryId: product.category.id,
                language: BASE_LANGUAGE,
                name: product.category.name,
                description: product.category.description,
            },
        });

        for (const variant of product.variants) {
            if (variant.price === null) {
                continue;
            }

            await prisma.productVariantPrice.upsert({
                where: {
                    variantId_currency: {
                        variantId: variant.id,
                        currency: BASE_CURRENCY,
                    },
                },
                update: {
                    amount: variant.price,
                },
                create: {
                    variantId: variant.id,
                    currency: BASE_CURRENCY,
                    amount: variant.price,
                },
            });
        }

        console.log(`Migrated product "${product.name}" → ${BASE_PRICE} RUB`);
    }

    console.log('Product data migration completed successfully.');
};

migrateProductData()
    .catch((error) => {
        console.error('Product data migration failed:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
