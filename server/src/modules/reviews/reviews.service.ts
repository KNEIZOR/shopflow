import type {
    CreateReviewInput,
    ReviewListQuery,
    UpdateReviewInput,
} from './reviews.schema';

import type { ReviewListResponse, ReviewResponse } from './reviews.types';

import { createReview as createReviewEntity } from './services/review-create.service';

import { deleteReview as deleteReviewEntity } from './services/review-delete.service';

import {
    getProductReviews as getProductReviewsEntity,
    getUserReviewForProduct as getUserReviewForProductEntity,
} from './services/review-query.service';

import { updateReview as updateReviewEntity } from './services/review-update.service';

export const getProductReviews = async (
    productId: string,
    query: ReviewListQuery,
): Promise<ReviewListResponse> => {
    return getProductReviewsEntity(productId, query);
};

export const getUserReviewForProduct = async (
    userId: string,
    productId: string,
): Promise<ReviewResponse | null> => {
    return getUserReviewForProductEntity(userId, productId);
};

export const createReview = async (
    userId: string,
    productId: string,
    input: CreateReviewInput,
): Promise<ReviewResponse> => {
    return createReviewEntity(userId, productId, input);
};

export const updateReview = async (
    userId: string,
    reviewId: string,
    input: UpdateReviewInput,
): Promise<ReviewResponse> => {
    return updateReviewEntity(userId, reviewId, input);
};

export const deleteReview = async (
    userId: string,
    reviewId: string,
): Promise<void> => {
    return deleteReviewEntity(userId, reviewId);
};
