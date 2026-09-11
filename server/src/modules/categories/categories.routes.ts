import { Router } from 'express';

import { requireAuth } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/admin';

import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoryBySlug,
    updateCategory,
} from './categories.controller';

import categoryTranslationsRouter from './translations/category-translations.routes';

const router = Router();

/**
 * Public
 */
router.get('/', getCategories);

/**
 * Admin category translations
 */
router.use('/:categoryId/translations', categoryTranslationsRouter);

/**
 * Public category by slug
 */
router.get('/:slug', getCategoryBySlug);

/**
 * Admin
 */
router.post('/', requireAuth, requireAdmin, createCategory);

router.patch('/:id', requireAuth, requireAdmin, updateCategory);

router.delete('/:id', requireAuth, requireAdmin, deleteCategory);

export default router;
