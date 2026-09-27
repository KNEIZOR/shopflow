import { apiRequest } from '@/shared/api';

import type { ApiResponse } from '@/shared/api/types';

import type {
    AdminOrderDetails,
    AdminOrdersData,
    AdminOrdersQuery,
    UpdateAdminOrderStatusInput,
} from './admin-orders.types';

const buildQueryString = (params: AdminOrdersQuery): string => {
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) {
        searchParams.set('page', String(params.page));
    }

    if (params.limit !== undefined) {
        searchParams.set('limit', String(params.limit));
    }

    if (params.search?.trim()) {
        searchParams.set('search', params.search.trim());
    }

    if (params.status) {
        searchParams.set('status', params.status);
    }

    if (params.paymentStatus) {
        searchParams.set('paymentStatus', params.paymentStatus);
    }

    if (params.sort) {
        searchParams.set('sort', params.sort);
    }

    const queryString = searchParams.toString();

    return queryString ? `?${queryString}` : '';
};

export const getAdminOrders = async (
    params: AdminOrdersQuery = {},
): Promise<AdminOrdersData> => {
    const response = await apiRequest<ApiResponse<AdminOrdersData>>(
        `/admin/orders${buildQueryString(params)}`,
    );

    return response.data;
};

export const getAdminOrderById = async (
    orderId: string,
): Promise<AdminOrderDetails> => {
    const response = await apiRequest<ApiResponse<AdminOrderDetails>>(
        `/admin/orders/${orderId}`,
    );

    return response.data;
};

export const updateAdminOrderStatus = async (
    orderId: string,
    input: UpdateAdminOrderStatusInput,
): Promise<AdminOrderDetails> => {
    const response = await apiRequest<ApiResponse<AdminOrderDetails>>(
        `/admin/orders/${orderId}/status`,
        {
            method: 'PATCH',
            body: JSON.stringify(input),
        },
    );

    return response.data;
};
