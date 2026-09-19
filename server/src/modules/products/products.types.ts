import type {
    CurrencyCode,
    ProductAttributeScope,
    ProductAttributeType,
} from '@prisma/client';

export type ProductImageResponse = {
    id: string;
    url: string;
    alt: string | null;
    position: number;
};

export type ProductAttributeResponse = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    type: ProductAttributeType;
    scope: ProductAttributeScope;
    isRequired: boolean;
    position: number;
};

export type ProductAttributeOptionResponse = {
    id: string;
    value: string;
    label: string;
    position: number;
};

export type ProductAttributeValueResponse = {
    id: string;
    attributeId: string;
    value: string;

    attribute: ProductAttributeResponse;
};

export type ProductVariantAttributeValueResponse = {
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

export type ProductVariantResponse = {
    id: string;
    name: string;
    sku: string;
    price: string | null;
    currency: CurrencyCode;
    stock: number;

    attributes: ProductVariantAttributeValueResponse[];
};

export type ProductCategoryResponse = {
    id: string;
    name: string;
    slug: string;
};

export type ProductTypeAttributeResponse = {
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

    options: ProductAttributeOptionResponse[];
};

export type ProductTypeResponse = {
    id: string;
    name: string;
    slug: string;
    attributes: ProductTypeAttributeResponse[];
};

export type ProductResponse = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: string;
    currency: CurrencyCode;
    status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

    category: ProductCategoryResponse;

    productType: ProductTypeResponse | null;

    attributes: ProductAttributeValueResponse[];

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
