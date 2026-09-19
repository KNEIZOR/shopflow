import type { Prisma } from '@prisma/client';

export type CartWithItems = Prisma.CartGetPayload<{
    select: {
        id: true;

        items: {
            include: {
                product: {
                    select: {
                        id: true;
                        name: true;
                        slug: true;
                        status: true;
                        price: true;
                        images: {
                            select: {
                                id: true;
                                url: true;
                                alt: true;
                                position: true;
                            };
                            orderBy: {
                                position: 'asc';
                            };
                            take: 1;
                        };
                    };
                };

                variant: {
                    select: {
                        id: true;
                        name: true;
                        sku: true;
                        price: true;
                        stock: true;
                        prices: {
                            select: {
                                currency: true;
                                amount: true;
                            };
                            orderBy: {
                                currency: 'asc';
                            };
                        };
                    };
                };
            };

            orderBy: {
                createdAt: 'asc';
            };
        };
    };
}>;

export type AddCartItemInput = {
    productId: string;
    variantId: string;
    quantity: number;
};

export type UpdateCartItemInput = {
    quantity: number;
};
