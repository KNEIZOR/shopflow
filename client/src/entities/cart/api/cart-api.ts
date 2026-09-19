import { apiRequest } from '@/shared/api';

import type {
    AddCartItemInput,
    Cart,
    CartItemResponse,
    EmptyCartResponse,
    GetCartResponse,
    UpdateCartItemInput,
} from '../model/types';

export const getCart = async (): Promise<Cart> => {
    const response = await apiRequest<GetCartResponse>('/cart');

    return response.data;
};

export const addCartItem = async (
    input: AddCartItemInput,
): Promise<CartItemResponse['data']> => {
    const response = await apiRequest<CartItemResponse>('/cart/items', {
        method: 'POST',
        body: JSON.stringify(input),
    });

    return response.data;
};

export const updateCartItem = async (
    itemId: string,
    input: UpdateCartItemInput,
): Promise<CartItemResponse['data']> => {
    const response = await apiRequest<CartItemResponse>(
        `/cart/items/${itemId}`,
        {
            method: 'PATCH',
            body: JSON.stringify(input),
        },
    );

    return response.data;
};

export const removeCartItem = async (itemId: string): Promise<void> => {
    await apiRequest<void>(`/cart/items/${itemId}`, {
        method: 'DELETE',
    });
};

export const clearCart = async (): Promise<void> => {
    await apiRequest<EmptyCartResponse>('/cart/items', {
        method: 'DELETE',
    });
};
