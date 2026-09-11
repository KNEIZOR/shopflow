import { Router } from 'express';

import { requireAuth } from '../../../middleware/auth';
import { requireAdmin } from '../../../middleware/admin';

import {
    deleteCategoryTranslation,
    getCategoryTranslation,
    getCategoryTranslations,
    upsertCategoryTranslation,
} from './category-translations.controller';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/', getCategoryTranslations);

router.get('/:language', getCategoryTranslation);

router.put('/:language', upsertCategoryTranslation);

router.delete('/:language', deleteCategoryTranslation);

export default router;
