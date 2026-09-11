export type ProductTranslationResponse = {
    id: string;
    productId: string;
    language: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type ProductTranslationsResponse = {
    items: ProductTranslationResponse[];
};
