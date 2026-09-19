import { apiRequest } from '@/shared/api';

import type { Order, OrderListResponse, OrderResponse } from '../model/types';

export const getOrders = async (): Promise<Order[]> => {
    const response = await apiRequest<OrderListResponse>('/orders');

    return response.data;
};

export const getOrder = async (orderId: string): Promise<Order> => {
    const response = await apiRequest<OrderResponse>(`/orders/${orderId}`);

    return response.data;
};
