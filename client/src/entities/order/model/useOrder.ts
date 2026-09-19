import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/entities/auth';

import { getOrder } from '../api/order-api';

import { orderQueryKeys } from './order-query-keys';

export const useOrder = (orderId: string) => {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    return useQuery({
        queryKey: orderQueryKeys.detail(orderId),

        queryFn: () => getOrder(orderId),

        enabled: Boolean(orderId) && isAuthenticated && !isAuthLoading,

        staleTime: 30 * 1000,

        retry: false,
    });
};
