export type CreateOrderInput = {
    addressId: string;
};

export type CreateOrderResult = {
    id: string;
    total: string;
    currency: string;
    status: string;
    paymentStatus: string;
    createdAt: Date;
    items: Array<{
        id: string;
        productId: string;
        variantId: string;
        quantity: number;
        price: string;
    }>;
};
