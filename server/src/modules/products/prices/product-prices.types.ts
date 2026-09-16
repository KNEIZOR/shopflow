export type ProductPriceResponse = {
    id: string;
    productId: string;
    currency: 'RUB' | 'EUR' | 'USD' | 'AMD';
    amount: string;
    createdAt: Date;
    updatedAt: Date;
};

export type ProductPricesResponse = {
    items: ProductPriceResponse[];
};
