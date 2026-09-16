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
    createProductAttribute,
    deleteProductAttribute,
    getProductAttributes,
    updateProductAttribute,
} from './product-attributes.controller';

import {
    createProductVariantAttribute,
    deleteProductVariantAttribute,
    getProductVariantAttributes,
    updateProductVariantAttribute,
} from './product-variant-attributes.controller';

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
 * Admin product attributes
 */
router.get(
    '/admin/:productId/attributes',
    requireAuth,
    requireAdmin,
    getProductAttributes,
);

router.post(
    '/admin/:productId/attributes',
    requireAuth,
    requireAdmin,
    createProductAttribute,
);

router.patch(
    '/admin/:productId/attributes/:attributeId',
    requireAuth,
    requireAdmin,
    updateProductAttribute,
);

router.delete(
    '/admin/:productId/attributes/:attributeId',
    requireAuth,
    requireAdmin,
    deleteProductAttribute,
);

/**
 * Admin product variant attributes
 */
router.get(
    '/admin/:productId/variants/:variantId/attributes',
    requireAuth,
    requireAdmin,
    getProductVariantAttributes,
);

router.post(
    '/admin/:productId/variants/:variantId/attributes',
    requireAuth,
    requireAdmin,
    createProductVariantAttribute,
);

router.patch(
    '/admin/:productId/variants/:variantId/attributes/:attributeId',
    requireAuth,
    requireAdmin,
    updateProductVariantAttribute,
);

router.delete(
    '/admin/:productId/variants/:variantId/attributes/:attributeId',
    requireAuth,
    requireAdmin,
    deleteProductVariantAttribute,
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
