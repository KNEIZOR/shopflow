import { apiRequest } from '@/shared/api';

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
};

const buildQueryString = (params: GetProductsParams = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
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

    const response = await apiRequest<ProductListResponse>(`/products${query}`);

    return response;
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
    const response = await apiRequest<{ product: Product }>(
        `/products/${slug}`,
    );

    return response.product;
};
