export type Category = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
};

export type CategoryListResponse = {
    items: Category[];
};

export type CreateCategoryInput = {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export type CategoryTranslation = {
    id: string;
    language: string;
    name: string;
    description: string | null;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
};

export type CategoryTranslationInput = {
    name: string;
    description?: string | null;
};

export type CategoryTranslationsResponse = {
    items: CategoryTranslation[];
};
