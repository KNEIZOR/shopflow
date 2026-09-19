import { apiRequest } from '@/shared/api';

import type {
    Category,
    CreateCategoryInput,
    UpdateCategoryInput,
} from '../model/types';

type CategoriesResponse = {
    success: boolean;
    categories: Category[];
};

type CategoryResponse = {
    success: boolean;
    category: Category;
};

type DeleteCategoryResponse = {
    success: boolean;
    message?: string;
};

export type GetCategoriesParams = {
    language?: string;
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

export const getCategories = async (
    params: GetCategoriesParams = {},
): Promise<Category[]> => {
    const query = buildQueryString(params);

    const response = await apiRequest<CategoriesResponse>(
        `/categories${query}`,
    );

    return response.categories;
};

export const getCategoryBySlug = async (
    slug: string,
    params: GetCategoriesParams = {},
): Promise<Category> => {
    const query = buildQueryString(params);

    const response = await apiRequest<CategoryResponse>(
        `/categories/${slug}${query}`,
    );

    return response.category;
};

export const createCategory = async (
    input: CreateCategoryInput,
): Promise<Category> => {
    const response = await apiRequest<CategoryResponse>('/categories', {
        method: 'POST',
        body: JSON.stringify(input),
    });

    return response.category;
};

export const updateCategory = async (
    id: string,
    input: UpdateCategoryInput,
): Promise<Category> => {
    const response = await apiRequest<CategoryResponse>(`/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
    });

    return response.category;
};

export const deleteCategory = async (
    id: string,
): Promise<DeleteCategoryResponse> => {
    return apiRequest<DeleteCategoryResponse>(`/categories/${id}`, {
        method: 'DELETE',
    });
};
