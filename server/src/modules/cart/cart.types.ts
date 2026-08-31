import type { Prisma } from '@prisma/client';

export type CartWithItems = Prisma.CartGetPayload<{
    include: {
        items: {
            include: {
                product: {
                    select: {
                        id: true;
                        name: true;
                        slug: true;
                        status: true;
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
