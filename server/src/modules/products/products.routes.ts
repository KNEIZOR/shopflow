import { Router } from 'express';

import { requireAuth } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/admin';

import {
    createProduct,
    deleteProduct,
    getAdminProductBySlug,
    getAdminProducts,
    getProductBySlug,
    getProducts,
    updateProduct,
} from './products.controller';
import {
    addProductImage,
    addProductVariant,
    deleteProductImage,
    deleteProductVariant,
    getProductImages,
    getProductVariants,
    updateProductImage,
    updateProductVariant,
} from './product-relations.controller';

const router = Router();

// Admin routes must come before /:slug
router.get('/admin/list', requireAuth, requireAdmin, getAdminProducts);

router.get('/admin/:slug', requireAuth, requireAdmin, getAdminProductBySlug);

router.post('/', requireAuth, requireAdmin, createProduct);

router.patch('/:id', requireAuth, requireAdmin, updateProduct);

router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

// Public catalog
router.get('/', getProducts);

router.get(
    '/admin/:productId/images',
    requireAuth,
    requireAdmin,
    getProductImages,
);

router.post(
    '/admin/:productId/images',
    requireAuth,
    requireAdmin,
    addProductImage,
);

router.patch(
    '/admin/:productId/images/:imageId',
    requireAuth,
    requireAdmin,
    updateProductImage,
);

router.delete(
    '/admin/:productId/images/:imageId',
    requireAuth,
    requireAdmin,
    deleteProductImage,
);

router.get(
    '/admin/:productId/variants',
    requireAuth,
    requireAdmin,
    getProductVariants,
);

router.post(
    '/admin/:productId/variants',
    requireAuth,
    requireAdmin,
    addProductVariant,
);

router.patch(
    '/admin/:productId/variants/:variantId',
    requireAuth,
    requireAdmin,
    updateProductVariant,
);

router.delete(
    '/admin/:productId/variants/:variantId',
    requireAuth,
    requireAdmin,
    deleteProductVariant,
);

router.get('/:slug', getProductBySlug);

export default router;
