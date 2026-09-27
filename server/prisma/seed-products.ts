import { PrismaClient, type CurrencyCode } from '@prisma/client';

import { products } from './seed/data/products';

const currencies: CurrencyCode[] = ['RUB', 'EUR', 'USD', 'AMD'];

const currencyRates: Record<CurrencyCode, number> = {
    RUB: 1,
    EUR: 0.0105,
    USD: 0.0115,
    AMD: 4.1,
};

const getCurrencyAmount = (rubPrice: number, currency: CurrencyCode) => {
    if (currency === 'RUB') {
        return rubPrice;
    }

    return Math.round(rubPrice * currencyRates[currency] * 100) / 100;
};

const getVariantCount = (productTypeSlug: string) => {
    switch (productTypeSlug) {
        case 'smartphone':
            return 3;

        case 'laptop':
            return 3;

        case 'headphones':
            return 2;

        case 'smart-watch':
            return 2;

        case 'furniture':
            return 2;

        case 'lighting':
            return 2;

        case 'clothing':
            return 5;

        case 'sneakers':
            return 5;

        case 'bag':
            return 3;

        case 'home-decor':
            return 2;

        default:
            return 2;
    }
};

const getVariantName = (productTypeSlug: string, index: number) => {
    const names: Record<string, string[]> = {
        smartphone: ['128 GB', '256 GB', '512 GB'],

        laptop: ['8 GB / 512 GB', '16 GB / 1 TB', '32 GB / 2 TB'],

        headphones: ['Black', 'White'],

        'smart-watch': ['41 mm', '45 mm'],

        furniture: ['Natural', 'Black'],

        lighting: ['Black', 'Brass'],

        clothing: ['S', 'M', 'L', 'XL', 'XXL'],

        sneakers: ['40', '41', '42', '43', '44'],

        bag: ['Black', 'Grey', 'Navy'],

        'home-decor': ['White', 'Beige'],
    };

    return names[productTypeSlug]?.[index] ?? `Variant ${index + 1}`;
};

export const seedProducts = async (
    prisma: PrismaClient,
    categoryMap: Map<string, string>,
    productTypeMap: Map<string, string>,
) => {
    for (const [index, product] of products.entries()) {
        const categoryId = categoryMap.get(product.categorySlug);

        const productTypeId = productTypeMap.get(product.productTypeSlug);

        if (!categoryId) {
            throw new Error(`Category not found: ${product.categorySlug}`);
        }

        if (!productTypeId) {
            throw new Error(
                `Product type not found: ${product.productTypeSlug}`,
            );
        }

        const dbProduct = await prisma.product.upsert({
            where: {
                slug: product.slug,
            },

            update: {
                name: product.name,
                description: product.description,
                price: product.price,
                status: 'ACTIVE',
                categoryId,
                productTypeId,

                images: {
                    deleteMany: {},

                    create: [
                        {
                            url: product.image,
                            alt: product.name,
                            position: 0,
                        },
                    ],
                },

                translations: {
                    deleteMany: {},

                    create: [
                        {
                            language: 'ru',
                            name: product.name,
                            description: product.description,
                        },
                        {
                            language: 'en',
                            name: product.name,
                            description: product.description,
                        },
                    ],
                },

                prices: {
                    deleteMany: {},

                    create: currencies.map((currency) => ({
                        currency,
                        amount: getCurrencyAmount(product.price, currency),
                    })),
                },
            },

            create: {
                name: product.name,
                slug: product.slug,
                description: product.description,
                price: product.price,
                status: 'ACTIVE',

                categoryId,
                productTypeId,

                images: {
                    create: [
                        {
                            url: product.image,
                            alt: product.name,
                            position: 0,
                        },
                    ],
                },

                translations: {
                    create: [
                        {
                            language: 'ru',
                            name: product.name,
                            description: product.description,
                        },
                        {
                            language: 'en',
                            name: product.name,
                            description: product.description,
                        },
                    ],
                },

                prices: {
                    create: currencies.map((currency) => ({
                        currency,
                        amount: getCurrencyAmount(product.price, currency),
                    })),
                },
            },
        });

        await prisma.productVariant.deleteMany({
            where: {
                productId: dbProduct.id,
            },
        });

        const variantCount = getVariantCount(product.productTypeSlug);

        for (
            let variantIndex = 0;
            variantIndex < variantCount;
            variantIndex++
        ) {
            const variantPrice =
                product.price +
                variantIndex * Math.max(500, Math.round(product.price * 0.04));

            const variant = await prisma.productVariant.create({
                data: {
                    name: getVariantName(product.productTypeSlug, variantIndex),

                    sku: `SF-${String(index + 1).padStart(3, '0')}-${String(
                        variantIndex + 1,
                    ).padStart(2, '0')}`,

                    price: variantPrice,

                    stock: 5 + ((index + variantIndex) % 46),

                    productId: dbProduct.id,

                    prices: {
                        create: currencies.map((currency) => ({
                            currency,

                            amount: getCurrencyAmount(variantPrice, currency),
                        })),
                    },
                },
            });
        }
    }

    console.log(`Seeded ${products.length} products.`);
};
