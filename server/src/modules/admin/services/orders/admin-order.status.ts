import { OrderStatus } from '@prisma/client';

import { AppError } from '../../../../errors/app-error';

export const allowedAdminOrderStatusTransitions: Record<
    OrderStatus,
    readonly OrderStatus[]
> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],

    CONFIRMED: ['PROCESSING', 'CANCELLED'],

    PROCESSING: ['SHIPPED', 'CANCELLED'],

    SHIPPED: ['DELIVERED'],

    DELIVERED: [],

    CANCELLED: [],
};

export const validateAdminOrderStatusTransition = (
    currentStatus: OrderStatus,
    nextStatus: OrderStatus,
) => {
    if (currentStatus === nextStatus) {
        return;
    }

    const allowed = allowedAdminOrderStatusTransitions[currentStatus];

    if (!allowed.includes(nextStatus)) {
        throw new AppError(
            400,
            'INVALID_ORDER_STATUS_TRANSITION',
            `Cannot change order status from ${currentStatus} to ${nextStatus}`,
        );
    }
};
