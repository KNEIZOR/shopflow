import { Router } from 'express';

import { requireAuth } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/admin';

import {
    createProductType,
    createProductTypeAttribute,
    createProductTypeOption,
    deleteProductType,
    deleteProductTypeAttribute,
    deleteProductTypeOption,
    getProductTypeAttributeById,
    getProductTypeAttributes,
    getProductTypeById,
    getProductTypeBySlug,
    getProductTypeOptionById,
    getProductTypeOptions,
    getProductTypes,
    updateProductType,
    updateProductTypeAttribute,
    updateProductTypeOption,
} from './product-types.controller';

const router = Router();

/**
 * Public
 */

router.get('/', getProductTypes);

router.get('/slug/:slug', getProductTypeBySlug);

router.get('/:id/attributes', getProductTypeAttributes);

router.get('/:id/attributes/:attributeId', getProductTypeAttributeById);

router.get('/:id/attributes/:attributeId/options', getProductTypeOptions);

router.get(
    '/:id/attributes/:attributeId/options/:optionId',
    getProductTypeOptionById,
);

/**
 * Admin
 */

router.post('/', requireAuth, requireAdmin, createProductType);

router.post(
    '/:id/attributes',
    requireAuth,
    requireAdmin,
    createProductTypeAttribute,
);

router.post(
    '/:id/attributes/:attributeId/options',
    requireAuth,
    requireAdmin,
    createProductTypeOption,
);

router.get('/id/:id', requireAuth, requireAdmin, getProductTypeById);

router.patch('/:id', requireAuth, requireAdmin, updateProductType);

router.patch(
    '/:id/attributes/:attributeId',
    requireAuth,
    requireAdmin,
    updateProductTypeAttribute,
);

router.patch(
    '/:id/attributes/:attributeId/options/:optionId',
    requireAuth,
    requireAdmin,
    updateProductTypeOption,
);

router.delete('/:id', requireAuth, requireAdmin, deleteProductType);

router.delete(
    '/:id/attributes/:attributeId',
    requireAuth,
    requireAdmin,
    deleteProductTypeAttribute,
);

router.delete(
    '/:id/attributes/:attributeId/options/:optionId',
    requireAuth,
    requireAdmin,
    deleteProductTypeOption,
);

export default router;
