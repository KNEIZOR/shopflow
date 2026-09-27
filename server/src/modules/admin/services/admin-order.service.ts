import { prisma } from '../../../lib/prisma';

import type {
    AdminOrderListQuery,
    UpdateAdminOrderStatusInput,
} from '../admin-order.schema';

import {
    adminOrderDetailsSelect,
    adminOrderListSelect,
} from './orders/admin-order.select';

import {
    mapAdminOrderDetails,
    mapAdminOrderListItem,
} from './orders/admin-order.mapper';

import {
    buildAdminOrderOrderBy,
    buildAdminOrderWhere,
    getAdminOrderPagination,
} from './orders/admin-order.query';

import { validateAdminOrderStatusTransition } from './orders/admin-order.status';

import { AppError } from '../../../errors/app-error';

export const getAdminOrders = async (query: AdminOrderListQuery) => {
    const { page, limit, sort } = query;

    const skip = (page - 1) * limit;

    const where = buildAdminOrderWhere(query);
    const orderBy = buildAdminOrderOrderBy(sort);

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            select: adminOrderListSelect,
        }),

        prisma.order.count({
            where,
        }),
    ]);

    return {
        items: orders.map(mapAdminOrderListItem),

        pagination: getAdminOrderPagination(page, limit, total),
    };
};

export const getAdminOrderById = async (orderId: string) => {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },

        select: adminOrderDetailsSelect,
    });

    if (!order) {
        throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
    }

    return mapAdminOrderDetails(order);
};

export const updateAdminOrderStatus = async (
    orderId: string,
    input: UpdateAdminOrderStatusInput,
) => {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },

        select: {
            id: true,
            status: true,
        },
    });

    if (!order) {
        throw new AppError(404, 'ORDER_NOT_FOUND', 'Order not found');
    }

    validateAdminOrderStatusTransition(order.status, input.status);

    const updatedOrder = await prisma.order.update({
        where: {
            id: orderId,
        },

        data: {
            status: input.status,
        },

        select: adminOrderDetailsSelect,
    });

    return mapAdminOrderDetails(updatedOrder);
};
