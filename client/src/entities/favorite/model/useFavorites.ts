import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/entities/auth';

import { getFavorites } from '../api/favorites-api';
import { favoriteQueryKeys } from './query-keys';

import type { CurrencyCode } from '@/shared/config/currencies';

type UseFavoritesParams = {
    language: string;
    currency: CurrencyCode;
};

export const useFavorites = ({ language, currency }: UseFavoritesParams) => {
    const { isAuthenticated } = useAuth();

    return useQuery({
        queryKey: favoriteQueryKeys.list(language, currency),

        queryFn: () =>
            getFavorites({
                language,
                currency,
            }),

        enabled: isAuthenticated,

        staleTime: 60 * 1000,

        retry: false,
    });
};
