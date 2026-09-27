import { Router } from 'express';

import { requireAuth } from '../../middleware/auth';

import {
    createFavorite,
    deleteFavorite,
    getFavorites,
} from './favorites.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getFavorites);

router.post('/:productId', createFavorite);

router.delete('/:productId', deleteFavorite);

export default router;
