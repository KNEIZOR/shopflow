import type { Prisma } from '@prisma/client';

import {
    adminOrderDetailsSelect,
    adminOrderListSelect,
} from './admin-order.select';

type AdminOrderList = Prisma.OrderGetPayload<{
    select: typeof adminOrderListSelect;
}>;

type AdminOrderDetails = Prisma.OrderGetPayload<{
    select: typeof adminOrderDetailsSelect;
}>;

const getCustomerName = (user: {
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

export const mapAdminOrderListItem = (order: AdminOrderList) => {
    return {
        id: order.id,

        total: order.total.toFixed(2),

        currency: order.currency,

        status: order.status,

        paymentStatus: order.paymentStatus,

        paymentProvider: order.paymentProvider,

        createdAt: order.createdAt,

        updatedAt: order.updatedAt,

        itemsCount: order._count.items,

        customer: {
            id: order.user.id,
            name: getCustomerName(order.user),
            email: order.user.email,
        },
    };
};

export const mapAdminOrderDetails = (order: AdminOrderDetails) => {
    return {
        id: order.id,

        total: order.total.toFixed(2),

        currency: order.currency,

        status: order.status,

        paymentStatus: order.paymentStatus,

        paymentProvider: order.paymentProvider,

        paymentSessionId: order.paymentSessionId,

        paymentIntentId: order.paymentIntentId,

        createdAt: order.createdAt,

        updatedAt: order.updatedAt,

        customer: {
            id: order.user.id,
            name: getCustomerName(order.user),
            email: order.user.email,
            firstName: order.user.firstName,
            lastName: order.user.lastName,
        },

        address: order.address,

        items: order.items.map((item) => ({
            id: item.id,

            quantity: item.quantity,

            price: item.price.toFixed(2),

            subtotal: item.price.mul(item.quantity).toFixed(2),

            product: item.product,

            variant: item.variant,
        })),
    };
};
