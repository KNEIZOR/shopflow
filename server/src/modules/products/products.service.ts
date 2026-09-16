import type { CurrencyCode } from '@prisma/client';

import type {
    CreateProductInput,
    ProductListQuery,
    UpdateProductInput,
} from './products.schema';

import type { ProductListResponse, ProductResponse } from './products.types';

import { createProduct as createProductEntity } from './services/product-create.service';

import { updateProduct as updateProductEntity } from './services/product-update.service';

import { deleteProduct as deleteProductEntity } from './services/product-delete.service';

import {
    getProductBySlug as getProductBySlugEntity,
    getProducts as getProductsEntity,
} from './services/product-query.service';

const DEFAULT_LANGUAGE = 'ru';

const DEFAULT_CURRENCY: CurrencyCode = 'RUB';

/**
 * Product service facade.
 *
 * The actual business logic is split into
 * specialized services inside the services directory.
 */

/**
 * Get products.
 */
export const getProducts = async (
    query: ProductListQuery,
    isAdmin = false,
): Promise<ProductListResponse> => {
    return getProductsEntity(query, isAdmin);
};

/**
 * Get product by slug.
 */
export const getProductBySlug = async (
    slug: string,
    isAdmin = false,
    language = DEFAULT_LANGUAGE,
    currency: CurrencyCode = DEFAULT_CURRENCY,
): Promise<ProductResponse> => {
    return getProductBySlugEntity(slug, isAdmin, language, currency);
};

/**
 * Create product.
 */
export const createProduct = async (
    input: CreateProductInput,
): Promise<ProductResponse> => {
    return createProductEntity(input);
};

/**
 * Update product.
 */
export const updateProduct = async (
    id: string,
    input: UpdateProductInput,
): Promise<ProductResponse> => {
    return updateProductEntity(id, input);
};

/**
 * Delete product.
 */
export const deleteProduct = async (id: string): Promise<void> => {
    return deleteProductEntity(id);
};
