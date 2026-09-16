export type ProductVariantPriceResponse = {
    id: string;
    variantId: string;
    currency: 'RUB' | 'EUR' | 'USD' | 'AMD';
    amount: string;
    createdAt: Date;
    updatedAt: Date;
};

export type ProductVariantPricesResponse = {
    items: ProductVariantPriceResponse[];
};
