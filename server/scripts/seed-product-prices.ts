import { PrismaClient, CurrencyCode } from '@prisma/client';

const prisma = new PrismaClient();

const PRODUCT_SLUG = 'stripe-test-product';

const PRICES = [
    {
        currency: CurrencyCode.RUB,
        amount: '2599.00',
    },
    {
        currency: CurrencyCode.EUR,
        amount: '29.99',
    },
    {
        currency: CurrencyCode.USD,
        amount: '32.99',
    },
    {
        currency: CurrencyCode.AMD,
        amount: '2999.00',
    },
] as const;

const seedProductPrices = async () => {
    const product = await prisma.product.findUnique({
        where: {
            slug: PRODUCT_SLUG,
        },

        select: {
            id: true,
            name: true,
        },
    });

    if (!product) {
        throw new Error(`Product "${PRODUCT_SLUG}" not found`);
    }

    for (const price of PRICES) {
        await prisma.productPrice.upsert({
            where: {
                productId_currency: {
                    productId: product.id,
                    currency: price.currency,
                },
            },

            update: {
                amount: price.amount,
            },

            create: {
                productId: product.id,
                currency: price.currency,
                amount: price.amount,
            },
        });
    }

    console.log(`Prices seeded for product: ${product.name}`);

    for (const price of PRICES) {
        console.log(`${price.currency}: ${price.amount}`);
    }
};

seedProductPrices()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
