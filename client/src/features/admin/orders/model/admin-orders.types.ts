export const ADMIN_ORDER_STATUSES = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
] as const;

export const ADMIN_PAYMENT_STATUSES = [
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED',
] as const;

export const ADMIN_ORDER_SORTS = [
    'newest',
    'oldest',
    'total_desc',
    'total_asc',
] as const;

export type AdminOrderStatus = (typeof ADMIN_ORDER_STATUSES)[number];

export type AdminPaymentStatus = (typeof ADMIN_PAYMENT_STATUSES)[number];

export type AdminOrderSort = (typeof ADMIN_ORDER_SORTS)[number];

export interface AdminOrderCustomer {
    id: string;
    name: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
}

export interface AdminOrderListItem {
    id: string;
    total: string;
    currency: string;
    status: AdminOrderStatus;
    paymentStatus: AdminPaymentStatus;
    paymentProvider: string | null;
    createdAt: string;
    updatedAt: string;
    itemsCount: number;
    customer: AdminOrderCustomer;
}

export interface AdminOrdersPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface AdminOrdersData {
    items: AdminOrderListItem[];
    pagination: AdminOrdersPagination;
}

export interface AdminOrdersQuery {
    page?: number;
    limit?: number;
    search?: string;
    status?: AdminOrderStatus;
    paymentStatus?: AdminPaymentStatus;
    sort?: AdminOrderSort;
}

export interface AdminOrderAddress {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    city: string;
    postalCode: string;
    street: string;
    apartment: string | null;
}

export interface AdminOrderProductImage {
    url: string;
    alt: string | null;
}

export interface AdminOrderProduct {
    id: string;
    name: string;
    slug: string;
    images: AdminOrderProductImage[];
}

export interface AdminOrderVariant {
    id: string;
    name: string;
    sku: string;
}

export interface AdminOrderItem {
    id: string;
    quantity: number;
    price: string;
    subtotal: string;
    product: AdminOrderProduct;
    variant: AdminOrderVariant;
}

export interface AdminOrderDetails {
    id: string;
    total: string;
    currency: string;
    status: AdminOrderStatus;
    paymentStatus: AdminPaymentStatus;
    paymentProvider: string | null;
    paymentSessionId: string | null;
    paymentIntentId: string | null;
    createdAt: string;
    updatedAt: string;
    customer: AdminOrderCustomer;
    address: AdminOrderAddress;
    items: AdminOrderItem[];
}

export interface UpdateAdminOrderStatusInput {
    status: AdminOrderStatus;
}
