import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createReview, deleteReview, updateReview } from '../api/review-api';

import { reviewQueryKeys } from './query-keys';

import type { CreateReviewInput, UpdateReviewInput } from './types';

export const useCreateReview = (productId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateReviewInput) =>
            createReview(productId, input),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: reviewQueryKeys.all,
            });
        },
    });
};

export const useUpdateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            reviewId,
            input,
        }: {
            reviewId: string;
            input: UpdateReviewInput;
        }) => updateReview(reviewId, input),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: reviewQueryKeys.all,
            });
        },
    });
};

export const useDeleteReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewId: string) => deleteReview(reviewId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: reviewQueryKeys.all,
            });
        },
    });
};
