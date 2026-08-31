export type ProductImageResponse = {
    id: string;
    url: string;
    alt: string | null;
    position: number;
};

export type ProductVariantResponse = {
    id: string;
    name: string;
    sku: string;
    price: string | null;
    stock: number;
};

export type ProductCategoryResponse = {
    id: string;
    name: string;
    slug: string;
};

export type ProductResponse = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: string;
    status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

    category: ProductCategoryResponse;

    images: ProductImageResponse[];
    variants: ProductVariantResponse[];

    createdAt: Date;
    updatedAt: Date;
};

export type ProductListResponse = {
    items: ProductResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};
