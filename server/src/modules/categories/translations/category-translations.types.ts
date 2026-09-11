export type CategoryTranslationResponse = {
    id: string;
    categoryId: string;
    language: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type CategoryTranslationsResponse = {
    items: CategoryTranslationResponse[];
};
