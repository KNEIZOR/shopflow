import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getMyProductReview, getProductReviews } from '../api/review-api';

import { reviewQueryKeys } from './query-keys';

export const useProductReviews = (productId: string, page = 1, limit = 5) => {
    return useQuery({
        queryKey: reviewQueryKeys.product(productId, page, limit),

        queryFn: () =>
            getProductReviews(productId, {
                page,
                limit,
            }),

        enabled: Boolean(productId),

        placeholderData: keepPreviousData,
    });
};

export const useMyProductReview = (
    productId: string,
    isAuthenticated: boolean,
) => {
    return useQuery({
        queryKey: reviewQueryKeys.mine(productId),

        queryFn: () => getMyProductReview(productId),

        enabled: Boolean(productId) && isAuthenticated,

        retry: false,
    });
};
