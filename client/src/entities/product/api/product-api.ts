import { apiRequest } from '@/shared/api';

import type { CurrencyCode } from '@/shared/config/currencies';

import type { Product, ProductListResponse } from '../model/types';

export type GetProductsParams = {
    page?: number;
    limit?: number;

    search?: string;

    category?: string;

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

export type GetProductBySlugParams = {
    language?: string;
    currency?: CurrencyCode;
};

const buildQueryString = (params: Record<string, unknown> = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.set(key, String(value));
        }
    });

    const query = searchParams.toString();

    return query ? `?${query}` : '';
};

export const getProducts = async (
    params?: GetProductsParams,
): Promise<ProductListResponse> => {
    const query = buildQueryString(params);

    return apiRequest<ProductListResponse>(`/products${query}`);
};

export const getProductBySlug = async (
    slug: string,
    params?: GetProductBySlugParams,
): Promise<Product> => {
    const query = buildQueryString(params);

    const response = await apiRequest<{
        product: Product;
    }>(`/products/${slug}${query}`);

    return response.product;
};
