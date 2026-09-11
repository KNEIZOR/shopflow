import { apiRequest } from '@/shared/api';
import type { CurrencyCode } from '@/shared/config/currencies';

export type ProductPrice = {
    id: string;
    productId: string;
    currency: CurrencyCode;
    amount: string;
    createdAt: string;
    updatedAt: string;
};

export type ProductPricesResponse = {
    items: ProductPrice[];
};

export type UpsertProductPriceInput = {
    amount: number;
};

export const getProductPrices = async (
    productId: string,
): Promise<ProductPricesResponse> => {
    const response = await apiRequest<{
        prices: ProductPrice[];
    }>(`/products/admin/${productId}/prices`);

    return {
        items: response.prices,
    };
};

export const getProductPrice = async (
    productId: string,
    currency: CurrencyCode,
): Promise<ProductPrice> => {
    const response = await apiRequest<{
        price: ProductPrice;
    }>(`/products/admin/${productId}/prices/${currency}`);

    return response.price;
};

export const upsertProductPrice = async (
    productId: string,
    currency: CurrencyCode,
    input: UpsertProductPriceInput,
): Promise<ProductPrice> => {
    const response = await apiRequest<{
        price: ProductPrice;
    }>(`/products/admin/${productId}/prices/${currency}`, {
        method: 'PUT',
        body: JSON.stringify(input),
    });

    return response.price;
};

export const deleteProductPrice = async (
    productId: string,
    currency: CurrencyCode,
): Promise<void> => {
    await apiRequest<void>(`/products/admin/${productId}/prices/${currency}`, {
        method: 'DELETE',
    });
};
