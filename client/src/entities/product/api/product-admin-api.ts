import { apiRequest } from '@/shared/api';

import type { CurrencyCode } from '@/shared/config/currencies';

import type { Product, ProductListResponse } from '../model/types';

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export type GetAdminProductsParams = {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: ProductStatus;
    minPrice?: number;
    maxPrice?: number;
    sort?:
        | 'newest'
        | 'oldest'
        | 'price_asc'
        | 'price_desc'
        | 'name_asc'
        | 'name_desc';
    language?: string;
    currency?: CurrencyCode;
};

export type GetAdminProductParams = {
    language?: string;
    currency?: CurrencyCode;
};

export type CreateProductInput = {
    name: string;
    slug: string;
    description?: string;
    price: number;
    status?: ProductStatus;
    categoryId: string;
    productTypeId?: string;
};

export type UpdateProductInput = {
    name?: string;
    slug?: string;
    description?: string;
    price?: number;
    status?: ProductStatus;
    categoryId?: string;
    productTypeId?: string | null;
};

const buildQueryString = (params: Record<string, unknown> = {}): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.set(key, String(value));
        }
    });

    const query = searchParams.toString();

    return query ? `?${query}` : '';
};

export const getAdminProducts = async (
    params?: GetAdminProductsParams,
): Promise<ProductListResponse> => {
    const query = buildQueryString(params);

    return apiRequest<ProductListResponse>(`/products/admin/list${query}`);
};

export const getAdminProductBySlug = async (
    slug: string,
    params?: GetAdminProductParams,
): Promise<Product> => {
    const query = buildQueryString(params);

    const response = await apiRequest<{
        product: Product;
    }>(`/products/admin/${slug}${query}`);

    return response.product;
};

export const createProduct = async (
    input: CreateProductInput,
): Promise<Product> => {
    const response = await apiRequest<{
        product: Product;
    }>('/products', {
        method: 'POST',
        body: JSON.stringify(input),
    });

    return response.product;
};

export const updateProduct = async (
    id: string,
    input: UpdateProductInput,
): Promise<Product> => {
    const response = await apiRequest<{
        product: Product;
    }>(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
    });

    return response.product;
};

export const deleteProduct = async (id: string): Promise<void> => {
    await apiRequest<void>(`/products/${id}`, {
        method: 'DELETE',
    });
};
