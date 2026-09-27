import type {
    AdminOrderSort,
    AdminOrderStatus,
    AdminPaymentStatus,
} from './admin-orders.types';

export const ADMIN_ORDERS_PAGE_SIZE = 10;

export const ADMIN_ORDER_STATUS_OPTIONS: ReadonlyArray<{
    value: AdminOrderStatus | '';
    labelKey: string;
}> = [
    {
        value: '',
        labelKey: 'admin.orders.filters.allStatuses',
    },
    {
        value: 'PENDING',
        labelKey: 'admin.orders.status.PENDING',
    },
    {
        value: 'CONFIRMED',
        labelKey: 'admin.orders.status.CONFIRMED',
    },
    {
        value: 'PROCESSING',
        labelKey: 'admin.orders.status.PROCESSING',
    },
    {
        value: 'SHIPPED',
        labelKey: 'admin.orders.status.SHIPPED',
    },
    {
        value: 'DELIVERED',
        labelKey: 'admin.orders.status.DELIVERED',
    },
    {
        value: 'CANCELLED',
        labelKey: 'admin.orders.status.CANCELLED',
    },
];

export const ADMIN_PAYMENT_STATUS_OPTIONS: ReadonlyArray<{
    value: AdminPaymentStatus | '';
    labelKey: string;
}> = [
    {
        value: '',
        labelKey: 'admin.orders.filters.allPaymentStatuses',
    },
    {
        value: 'PENDING',
        labelKey: 'admin.orders.paymentStatus.PENDING',
    },
    {
        value: 'PAID',
        labelKey: 'admin.orders.paymentStatus.PAID',
    },
    {
        value: 'FAILED',
        labelKey: 'admin.orders.paymentStatus.FAILED',
    },
    {
        value: 'REFUNDED',
        labelKey: 'admin.orders.paymentStatus.REFUNDED',
    },
];

export const ADMIN_ORDER_SORT_OPTIONS: ReadonlyArray<{
    value: AdminOrderSort;
    labelKey: string;
}> = [
    {
        value: 'newest',
        labelKey: 'admin.orders.filters.newest',
    },
    {
        value: 'oldest',
        labelKey: 'admin.orders.filters.oldest',
    },
    {
        value: 'total_desc',
        labelKey: 'admin.orders.filters.totalDesc',
    },
    {
        value: 'total_asc',
        labelKey: 'admin.orders.filters.totalAsc',
    },
];
