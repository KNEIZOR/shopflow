import { Prisma } from '@prisma/client';

import type { AdminOrderListQuery } from '../../admin-order.schema';

import { buildAdminOrderSearchFilter } from './admin-order.filters';

export const buildAdminOrderWhere = (
    query: AdminOrderListQuery,
): Prisma.OrderWhereInput => {
    const { search, status, paymentStatus } = query;

    const where: Prisma.OrderWhereInput = {
        ...buildAdminOrderSearchFilter(search ?? ''),
    };

    if (status) {
        where.status = status;
    }

    if (paymentStatus) {
        where.paymentStatus = paymentStatus;
    }

    return where;
};

export const buildAdminOrderOrderBy = (
    sort: AdminOrderListQuery['sort'],
):
    | Prisma.OrderOrderByWithRelationInput
    | Prisma.OrderOrderByWithRelationInput[] => {
    switch (sort) {
        case 'oldest':
            return {
                createdAt: 'asc',
            };

        case 'total_desc':
            return {
                total: 'desc',
            };

        case 'total_asc':
            return {
                total: 'asc',
            };

        case 'newest':
        default:
            return {
                createdAt: 'desc',
            };
    }
};

export const getAdminOrderPagination = (
    page: number,
    limit: number,
    total: number,
) => {
    const totalPages = Math.ceil(total / limit);

    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
};
