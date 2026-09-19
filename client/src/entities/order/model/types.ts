import type { CurrencyCode } from '@/shared/config/currencies';

export type OrderStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type OrderAddress = {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    city: string;
    postalCode: string;
    street: string;
    apartment: string | null;
};

export type OrderProductImage = {
    url: string;
    alt: string | null;
};

export type OrderProduct = {
    id: string;
    name: string;
    slug: string;
    images: OrderProductImage[];
};

export type OrderVariant = {
    id: string;
    name: string;
    sku: string;
};

export type OrderItem = {
    id: string;
    quantity: number;
    price: string;
    subtotal: string;
    product: OrderProduct;
    variant: OrderVariant;
};

export type Order = {
    id: string;
    total: string;
    currency: CurrencyCode;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentProvider: string | null;
    createdAt: string;
    updatedAt: string;
    address: OrderAddress;
    items: OrderItem[];
};

export type OrderListResponse = {
    success: boolean;
    data: Order[];
};

export type OrderResponse = {
    success: boolean;
    data: Order;
};
