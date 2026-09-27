import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    addFavorite,
    removeFavorite,
} from '../api/favorites-api';

import { favoriteQueryKeys } from './query-keys';

export const useAddFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addFavorite,

        onSuccess: () => {
            return queryClient.invalidateQueries({
                queryKey: favoriteQueryKeys.all,
            });
        },
    });
};

export const useRemoveFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeFavorite,

        onSuccess: () => {
            return queryClient.invalidateQueries({
                queryKey: favoriteQueryKeys.all,
            });
        },
    });
};