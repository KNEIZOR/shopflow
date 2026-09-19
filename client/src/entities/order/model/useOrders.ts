import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/entities/auth';

import { getOrders } from '../api/order-api';

import { orderQueryKeys } from './order-query-keys';

export const useOrders = () => {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    return useQuery({
        queryKey: orderQueryKeys.list(),

        queryFn: getOrders,

        enabled: isAuthenticated && !isAuthLoading,

        staleTime: 30 * 1000,

        retry: false,
    });
};
