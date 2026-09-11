import { apiRequest } from '@/shared/api';
import type { CurrencyCode } from '@/shared/config/currencies';

export type ProductVariantsResponse = {
    items: ProductVariantResponse[];
};

export type ProductVariantResponse = {
    id: string;
    name: string;
    sku: string;
    price: string | null;
    currency: CurrencyCode;
    stock: number;
};

export type CreateProductVariantInput = {
    name: string;
    sku: string;
    price?: number;
    stock?: number;
};

export type UpdateProductVariantInput = {
    name?: string;
    sku?: string;
    price?: number | null;
    stock?: number;
};

export const getProductVariants = async (
    productId: string,
): Promise<ProductVariantsResponse> => {
    const response = await apiRequest<{
        variants: ProductVariantResponse[];
    }>(`/products/admin/${productId}/variants`);

    return {
        items: response.variants,
    };
};

export const createProductVariant = async (
    productId: string,
    input: CreateProductVariantInput,
): Promise<ProductVariantResponse> => {
    const response = await apiRequest<{
        variant: ProductVariantResponse;
    }>(`/products/admin/${productId}/variants`, {
        method: 'POST',
        body: JSON.stringify(input),
    });

    return response.variant;
};

export const updateProductVariant = async (
    productId: string,
    variantId: string,
    input: UpdateProductVariantInput,
): Promise<ProductVariantResponse> => {
    const response = await apiRequest<{
        variant: ProductVariantResponse;
    }>(`/products/admin/${productId}/variants/${variantId}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
    });

    return response.variant;
};

export const deleteProductVariant = async (
    productId: string,
    variantId: string,
): Promise<void> => {
    await apiRequest<void>(
        `/products/admin/${productId}/variants/${variantId}`,
        {
            method: 'DELETE',
        },
    );
};
