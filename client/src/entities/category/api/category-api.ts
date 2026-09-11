import { apiRequest } from '@/shared/api';

import type { Category } from '../model/types';

type CategoriesResponse = {
    success: boolean;
    categories: Category[];
};

type CategoryResponse = {
    success: boolean;
    category: Category;
};

export const getCategories = async (): Promise<Category[]> => {
    const response = await apiRequest<CategoriesResponse>('/categories');

    return response.categories;
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
    const response = await apiRequest<CategoryResponse>(`/categories/${slug}`);

    return response.category;
};
