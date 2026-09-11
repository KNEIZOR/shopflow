import type { CurrencyCode } from '@/shared/config/currencies';

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export type ProductImage = {
    id: string;
    url: string;
    alt: string | null;
    position: number;
};

export type ProductVariant = {
    id: string;
    name: string;
    sku: string;
    price: string | null;
    currency: CurrencyCode;
    stock: number;
};

export type ProductCategory = {
    id: string;
    name: string;
    slug: string;
};

export type Product = {
    id: string;
    name: string;
    slug: string;
    description: string | null;

    price: string;
    currency: CurrencyCode;

    status: ProductStatus;

    category: ProductCategory;

    images: ProductImage[];
    variants: ProductVariant[];

    createdAt: string;
    updatedAt: string;
};

export type ProductListResponse = {
    items: Product[];

    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};
