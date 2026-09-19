import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/entities/auth';

import { getCart } from '../api/cart-api';

import { cartQueryKeys } from './cart-query-keys';

export const useCart = () => {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    return useQuery({
        queryKey: cartQueryKeys.detail(),
        queryFn: getCart,

        enabled: isAuthenticated && !isAuthLoading,

        staleTime: 30 * 1000,

        retry: false,
    });
};
