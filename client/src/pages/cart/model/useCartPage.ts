import { useAuth } from '@/entities/auth';
import { useCart } from '@/entities/cart';

export const useCartPage = () => {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    const cartQuery = useCart();

    return {
        isAuthenticated,
        isAuthLoading,

        cart: cartQuery.data ?? null,

        isLoading: isAuthLoading || (isAuthenticated && cartQuery.isLoading),

        isError: isAuthenticated && cartQuery.isError,

        refetch: cartQuery.refetch,
    };
};
