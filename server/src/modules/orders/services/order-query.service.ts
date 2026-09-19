import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../errors/app-error';

const orderInclude = {
    address: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            country: true,
            city: true,
            postalCode: true,
            street: true,
            apartment: true,
        },
    },

    items: {
        orderBy: {
            createdAt: 'asc' as const,
        },

        select: {
            id: true,
            quantity: true,
            price: true,

            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,

                    images: {
                        orderBy: {
                            position: 'asc' as const,
                        },
                        take: 1,
                        select: {
                            url: true,
                            alt: true,
                        },
                    },
                },
            },

            variant: {
                select: {
                    id: true,
                    name: true,
                    sku: true,
                },
            },
        },
    },
} as const;

const mapOrder = (order: {
    id: string;
    total: unknown;
    currency: string;
    status: string;
    paymentStatus: string;
    paymentProvider: string | null;
    createdAt: Date;
    updatedAt: Date;
    address: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        country: string;
        city: string;
        postalCode: string;
        street: string;
        apartment: string | null;
    };
    items: Array<{
        id: string;
        quantity: number;
        price: unknown;
        product: {
            id: string;
            name: string;
            slug: string;
            images: Array<{
                url: string;
                alt: string | null;
            }>;
        };
        variant: {
            id: string;
            name: string;
            sku: string;
        };
    }>;
}) => {
    return {
        id: order.id,
        total: Number(order.total).toFixed(2),
        currency: order.currency,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentProvider: order.paymentProvider,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,

        address: order.address,

        items: order.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: Number(item.price).toFixed(2),

            subtotal: (Number(item.price) * item.quantity).toFixed(2),

            product: item.product,

            variant: item.variant,
        })),
    };
};

export const getUserOrders = async (userId: string) => {
    const orders = await prisma.order.findMany({
        where: {
            userId,
        },

        include: orderInclude,

        orderBy: {
            createdAt: 'desc',
        },
    });

    return orders.map(mapOrder);
};

export const getUserOrderById = async (userId: string, orderId: string) => {
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            userId,
        },

        include: orderInclude,
    });

    if (!order) {
        throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
    }

    return mapOrder(order);
};
