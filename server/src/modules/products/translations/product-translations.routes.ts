import { Router } from 'express';

import { requireAuth } from '../../../middleware/auth';
import { requireAdmin } from '../../../middleware/admin';

import {
    deleteProductTranslation,
    getProductTranslation,
    getProductTranslations,
    upsertProductTranslation,
} from './product-translations.controller';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/', getProductTranslations);

router.get('/:language', getProductTranslation);

router.put('/:language', upsertProductTranslation);

router.delete('/:language', deleteProductTranslation);

export default router;
