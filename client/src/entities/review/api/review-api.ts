import { apiRequest } from '@/shared/api';

import type {
    CreateReviewInput,
    Review,
    ReviewListResponse,
    UpdateReviewInput,
} from '../model/types';

export type GetProductReviewsParams = {
    page?: number;
    limit?: number;
};

type ApiResponse<T> = {
    success: boolean;
    data: T;
};

const buildQueryString = (params: Record<string, unknown> = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.set(key, String(value));
        }
    });

    const query = searchParams.toString();

    return query ? `?${query}` : '';
};

export const getProductReviews = async (
    productId: string,
    params?: GetProductReviewsParams,
): Promise<ReviewListResponse> => {
    const query = buildQueryString(params);

    const response = await apiRequest<ApiResponse<ReviewListResponse>>(
        `/reviews/product/${productId}${query}`,
    );

    return response.data;
};

export const getMyProductReview = async (
    productId: string,
): Promise<Review | null> => {
    const response = await apiRequest<ApiResponse<Review | null>>(
        `/reviews/product/${productId}/me`,
    );

    return response.data;
};

export const createReview = async (
    productId: string,
    input: CreateReviewInput,
): Promise<Review> => {
    const response = await apiRequest<ApiResponse<Review>>(
        `/reviews/product/${productId}`,
        {
            method: 'POST',
            body: JSON.stringify(input),
        },
    );

    return response.data;
};

export const updateReview = async (
    reviewId: string,
    input: UpdateReviewInput,
): Promise<Review> => {
    const response = await apiRequest<ApiResponse<Review>>(
        `/reviews/${reviewId}`,
        {
            method: 'PATCH',
            body: JSON.stringify(input),
        },
    );

    return response.data;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
    await apiRequest<void>(`/reviews/${reviewId}`, {
        method: 'DELETE',
    });
};
