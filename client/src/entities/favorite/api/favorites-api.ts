import { apiRequest } from '@/shared/api';

import type { CurrencyCode } from '@/shared/config/currencies';

import type { FavoriteItem } from '../model/types';

type FavoritesResponse = {
    success: boolean;
    data: FavoriteItem[];
};

type FavoriteResponse = {
    success: boolean;
    data: {
        id: string;
        createdAt: string;
        userId: string;
        productId: string;
    };
};

export type GetFavoritesParams = {
    language?: string;
    currency?: CurrencyCode;
};

const buildQueryString = (params: Record<string, unknown> = {}): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.set(key, String(value));
        }
    });

    const query = searchParams.toString();

    return query ? `?${query}` : '';
};

export const getFavorites = async (
    params?: GetFavoritesParams,
): Promise<FavoriteItem[]> => {
    const query = buildQueryString(params);

    const response = await apiRequest<FavoritesResponse>(`/favorites${query}`);

    return response.data;
};

export const addFavorite = async (
    productId: string,
): Promise<FavoriteResponse['data']> => {
    const response = await apiRequest<FavoriteResponse>(
        `/favorites/${productId}`,
        {
            method: 'POST',
        },
    );

    return response.data;
};

export const removeFavorite = async (productId: string): Promise<void> => {
    await apiRequest<void>(`/favorites/${productId}`, {
        method: 'DELETE',
    });
};
