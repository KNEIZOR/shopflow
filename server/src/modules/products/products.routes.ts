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

import productTranslationsRouter from './translations/product-translations.routes';
import productPricesRouter from './prices/product-prices.routes';
import productVariantPricesRouter from './variant-prices/product-variant-prices.routes';

const router = Router();

/**
 * Admin product list/details
 */
router.get('/admin/list', requireAuth, requireAdmin, getAdminProducts);

router.get('/admin/:slug', requireAuth, requireAdmin, getAdminProductBySlug);

/**
 * Admin product CRUD
 */
router.post('/', requireAuth, requireAdmin, createProduct);

router.patch('/:id', requireAuth, requireAdmin, updateProduct);

router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

/**
 * Public catalog
 */
router.get('/', getProducts);

/**
 * Admin product images
 */
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

/**
 * Admin product variants
 */
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

/**
 * Admin product translations
 */
router.use('/admin/:productId/translations', productTranslationsRouter);

/**
 * Admin product prices
 */
router.use('/admin/:productId/prices', productPricesRouter);

/**
 * Admin product variant prices
 */
router.use(
    '/admin/:productId/variants/:variantId/prices',
    productVariantPricesRouter,
);

/**
 * Public product by slug
 */
router.get('/:slug', getProductBySlug);

export default router;
