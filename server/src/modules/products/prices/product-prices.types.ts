export type ProductPriceResponse = {
    id: string;
    productId: string;
    currency: 'RUB' | 'EUR' | 'USD' | 'GBP';
    amount: string;
    createdAt: Date;
    updatedAt: Date;
};

export type ProductPricesResponse = {
    items: ProductPriceResponse[];
};
