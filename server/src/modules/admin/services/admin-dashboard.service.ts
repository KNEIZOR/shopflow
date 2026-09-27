import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';

import { prisma } from '../../../lib/prisma';

const ORDER_STATUSES: readonly OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
];

const recentOrderSelect = {
    id: true,
    total: true,
    currency: true,
    status: true,
    paymentStatus: true,
    createdAt: true,

    user: {
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
        },
    },

    _count: {
        select: {
            items: true,
        },
    },
} as const;

const mapCustomerName = (user: {
    email: string;
    firstName: string | null;
    lastName: string | null;
}) => {
    const fullName = [user.firstName, user.lastName]
        .filter(Boolean)
        .join(' ')
        .trim();

    return fullName || user.email;
};

export const getAdminDashboard = async () => {
    const [
        productsCount,
        ordersCount,
        usersCount,
        revenueAggregate,
        orderStatusGroups,
        recentOrders,
    ] = await Promise.all([
        prisma.product.count(),

        prisma.order.count(),

        prisma.user.count(),

        prisma.order.aggregate({
            where: {
                paymentStatus: PaymentStatus.PAID,
            },

            _sum: {
                total: true,
            },
        }),

        prisma.order.groupBy({
            by: ['status'],

            _count: {
                _all: true,
            },
        }),

        prisma.order.findMany({
            orderBy: {
                createdAt: 'desc',
            },

            take: 8,

            select: recentOrderSelect,
        }),
    ]);

    const orderStatuses = ORDER_STATUSES.reduce(
        (result, status) => {
            result[status] = 0;

            return result;
        },
        {} as Record<OrderStatus, number>,
    );

    for (const group of orderStatusGroups) {
        orderStatuses[group.status] = group._count._all;
    }

    const revenue =
        revenueAggregate._sum.total instanceof Prisma.Decimal
            ? revenueAggregate._sum.total.toFixed(2)
            : '0.00';

    return {
        stats: {
            products: productsCount,
            orders: ordersCount,
            users: usersCount,
            revenue,
            revenueCurrency: 'RUB',
        },

        orderStatuses,

        recentOrders: recentOrders.map((order) => ({
            id: order.id,
            total: order.total.toFixed(2),
            currency: order.currency,
            status: order.status,
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt,
            itemsCount: order._count.items,

            customer: {
                id: order.user.id,
                name: mapCustomerName(order.user),
                email: order.user.email,
            },
        })),
    };
};
