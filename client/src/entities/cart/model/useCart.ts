import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/entities/auth';
import { useLocale } from '@/entities/locale';

import { getCart } from '../api/cart-api';

import { cartQueryKeys } from './cart-query-keys';

export const useCart = () => {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    const { currency } = useLocale();

    return useQuery({
        queryKey: cartQueryKeys.detail(currency),

        queryFn: () => getCart(currency),

        enabled: isAuthenticated && !isAuthLoading,

        staleTime: 30 * 1000,

        retry: false,
    });
};
