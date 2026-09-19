import type { CurrencyCode } from '@/shared/config/currencies';

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export type ProductAttributeType = 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT';

export type ProductAttributeScope = 'PRODUCT' | 'VARIANT' | 'BOTH';

export type ProductImage = {
    id: string;
    url: string;
    alt: string | null;
    position: number;
};

export type ProductAttribute = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    type: ProductAttributeType;
    scope: ProductAttributeScope;
    isRequired: boolean;
    position: number;
};

export type ProductAttributeOption = {
    id: string;
    value: string;
    label: string;
    position: number;
};

export type ProductAttributeValue = {
    id: string;
    attributeId: string;
    value: string;
    attribute: ProductAttribute;
};

export type ProductTypeAttribute = {
    id: string;
    attributeId: string;
    isRequired: boolean;
    position: number;
    attribute: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        type: ProductAttributeType;
        scope: ProductAttributeScope;
    };
    options: ProductAttributeOption[];
};

export type ProductType = {
    id: string;
    name: string;
    slug: string;
    attributes: ProductTypeAttribute[];
};

export type ProductVariantAttribute = {
    id: string;
    attributeId: string;
    value: string;
    attribute: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        type: ProductAttributeType;
        scope: ProductAttributeScope;
    };
};

export type ProductVariant = {
    id: string;
    name: string;
    sku: string;
    price: string | null;
    currency: CurrencyCode;
    stock: number;
    attributes: ProductVariantAttribute[];
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

    productType: ProductType | null;

    attributes: ProductAttributeValue[];

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
