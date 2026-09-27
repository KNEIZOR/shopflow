import { Router } from 'express';

import { requireAuth } from '../../middleware/auth';

import {
    createReview,
    deleteReview,
    getMyProductReview,
    getProductReviews,
    updateReview,
} from './reviews.controller';

const router = Router();

/**
 * Public product reviews.
 */
router.get('/product/:productId', getProductReviews);

/**
 * Authenticated user reviews.
 */
router.get('/product/:productId/me', requireAuth, getMyProductReview);

router.post('/product/:productId', requireAuth, createReview);

router.patch('/:reviewId', requireAuth, updateReview);

router.delete('/:reviewId', requireAuth, deleteReview);

export default router;
