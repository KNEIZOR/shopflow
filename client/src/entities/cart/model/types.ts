import type { CurrencyCode } from '@/shared/config/currencies';

export type CartProductImage = {
    id: string;
    url: string;
    alt: string | null;
};

export type CartProduct = {
    id: string;
    name: string;
    slug: string;
    image: CartProductImage | null;
};

export type CartVariant = {
    id: string;
    name: string;
    sku: string;
    price: string | null;
    stock: number;
};

export type CartItem = {
    id: string;
    quantity: number;
    product: CartProduct;
    variant: CartVariant;
    subtotal: string;
};

export type CartSummary = {
    itemsCount: number;
    subtotal: string;
    currency: CurrencyCode;
};

export type Cart = {
    id: string | null;
    items: CartItem[];
    summary: CartSummary;
};

export type GetCartResponse = {
    success: boolean;
    data: Cart;
};

export type AddCartItemInput = {
    productId: string;
    variantId: string;
    quantity: number;
};

export type UpdateCartItemInput = {
    quantity: number;
};

export type CartItemResponse = {
    success: boolean;
    data: CartItem;
};

export type EmptyCartResponse = {
    success: boolean;
};
