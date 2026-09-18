import { Router } from 'express';

import { requireAuth } from '../../../middleware/auth';
import { requireAdmin } from '../../../middleware/admin';

import {
    deleteProductVariantPrice,
    getProductVariantPrice,
    getProductVariantPrices,
    upsertProductVariantPrice,
} from './product-variant-prices.controller';

const router = Router({
    mergeParams: true,
});

router.use(requireAuth, requireAdmin);

router.get('/', getProductVariantPrices);

router.get('/:currency', getProductVariantPrice);

router.put('/:currency', upsertProductVariantPrice);

router.delete('/:currency', deleteProductVariantPrice);

export default router;
