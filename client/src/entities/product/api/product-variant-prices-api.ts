import { apiRequest } from '@/shared/api';
import type { CurrencyCode } from '@/shared/config/currencies';

export type ProductVariantPrice = {
    id: string;
    variantId: string;
    currency: CurrencyCode;
    amount: string;
    createdAt: string;
    updatedAt: string;
};

export type ProductVariantPricesResponse = {
    items: ProductVariantPrice[];
};

export type UpsertProductVariantPriceInput = {
    amount: number;
};

export const getProductVariantPrices = async (
    productId: string,
    variantId: string,
): Promise<ProductVariantPricesResponse> => {
    const response = await apiRequest<{
        prices: ProductVariantPrice[];
    }>(`/products/admin/${productId}/variants/${variantId}/prices`);

    return {
        items: response.prices,
    };
};

export const getProductVariantPrice = async (
    productId: string,
    variantId: string,
    currency: CurrencyCode,
): Promise<ProductVariantPrice> => {
    const response = await apiRequest<{
        price: ProductVariantPrice;
    }>(`/products/admin/${productId}/variants/${variantId}/prices/${currency}`);

    return response.price;
};

export const upsertProductVariantPrice = async (
    productId: string,
    variantId: string,
    currency: CurrencyCode,
    input: UpsertProductVariantPriceInput,
): Promise<ProductVariantPrice> => {
    const response = await apiRequest<{
        price: ProductVariantPrice;
    }>(
        `/products/admin/${productId}/variants/${variantId}/prices/${currency}`,
        {
            method: 'PUT',
            body: JSON.stringify(input),
        },
    );

    return response.price;
};

export const deleteProductVariantPrice = async (
    productId: string,
    variantId: string,
    currency: CurrencyCode,
): Promise<void> => {
    await apiRequest<void>(
        `/products/admin/${productId}/variants/${variantId}/prices/${currency}`,
        {
            method: 'DELETE',
        },
    );
};
