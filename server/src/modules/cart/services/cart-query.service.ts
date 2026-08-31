import { prisma } from '../../../lib/prisma';

export const getCartByUserId = async (userId: string) => {
    let cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            status: true,
                            images: {
                                select: {
                                    id: true,
                                    url: true,
                                    alt: true,
                                    position: true,
                                },
                                orderBy: {
                                    position: 'asc',
                                },
                                take: 1,
                            },
                        },
                    },
                    variant: {
                        select: {
                            id: true,
                            name: true,
                            sku: true,
                            price: true,
                            stock: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                userId,
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                status: true,
                                images: {
                                    select: {
                                        id: true,
                                        url: true,
                                        alt: true,
                                        position: true,
                                    },
                                    orderBy: {
                                        position: 'asc',
                                    },
                                    take: 1,
                                },
                            },
                        },
                        variant: {
                            select: {
                                id: true,
                                name: true,
                                sku: true,
                                price: true,
                                stock: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });
    }

    return cart;
};
