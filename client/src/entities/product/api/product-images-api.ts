import { apiRequest } from '@/shared/api';

import type { ProductImage } from '../model/types';

export type ProductImagesResponse = {
    items: ProductImage[];
};

export type CreateProductImageInput = {
    url: string;
    alt?: string;
    position?: number;
};

export type UpdateProductImageInput = {
    url?: string;
    alt?: string | null;
    position?: number;
};

export const getProductImages = async (
    productId: string,
): Promise<ProductImagesResponse> => {
    const response = await apiRequest<{
        images: ProductImage[];
    }>(`/products/admin/${productId}/images`);

    return {
        items: response.images,
    };
};

export const createProductImage = async (
    productId: string,
    input: CreateProductImageInput,
): Promise<ProductImage> => {
    const response = await apiRequest<{
        image: ProductImage;
    }>(`/products/admin/${productId}/images`, {
        method: 'POST',
        body: JSON.stringify(input),
    });

    return response.image;
};

export const updateProductImage = async (
    productId: string,
    imageId: string,
    input: UpdateProductImageInput,
): Promise<ProductImage> => {
    const response = await apiRequest<{
        image: ProductImage;
    }>(`/products/admin/${productId}/images/${imageId}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
    });

    return response.image;
};

export const deleteProductImage = async (
    productId: string,
    imageId: string,
): Promise<void> => {
    await apiRequest<void>(`/products/admin/${productId}/images/${imageId}`, {
        method: 'DELETE',
    });
};
