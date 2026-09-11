import { Router } from 'express';

import { requireAuth } from '../../../middleware/auth';
import { requireAdmin } from '../../../middleware/admin';

import {
    deleteProductPrice,
    getProductPrice,
    getProductPrices,
    upsertProductPrice,
} from './product-prices.controller';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/', getProductPrices);

router.get('/:currency', getProductPrice);

router.put('/:currency', upsertProductPrice);

router.delete('/:currency', deleteProductPrice);

export default router;
