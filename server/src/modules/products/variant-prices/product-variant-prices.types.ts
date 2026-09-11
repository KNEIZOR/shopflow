export type ProductVariantPriceResponse = {
    id: string;
    variantId: string;
    currency: 'RUB' | 'EUR' | 'USD' | 'GBP';
    amount: string;
    createdAt: Date;
    updatedAt: Date;
};

export type ProductVariantPricesResponse = {
    items: ProductVariantPriceResponse[];
};
