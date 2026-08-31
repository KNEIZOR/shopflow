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

const router = Router();

// Public
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin
router.post('/', requireAuth, requireAdmin, createCategory);

router.patch('/:id', requireAuth, requireAdmin, updateCategory);

router.delete('/:id', requireAuth, requireAdmin, deleteCategory);

export default router;
