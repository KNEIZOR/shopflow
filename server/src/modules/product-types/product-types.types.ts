import type {
    ProductAttributeScope,
    ProductAttributeType,
} from '@prisma/client';

export type ProductTypeAttributeOptionResponse = {
    id: string;
    value: string;
    label: string;
    position: number;
};

export type ProductTypeAttributeResponse = {
    id: string;
    attributeId: string;
    name: string;
    slug: string;
    description: string | null;
    type: ProductAttributeType;
    scope: ProductAttributeScope;
    isRequired: boolean;
    position: number;
    options: ProductTypeAttributeOptionResponse[];
};

export type ProductTypeResponse = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    attributes: ProductTypeAttributeResponse[];
    createdAt: Date;
    updatedAt: Date;
};

export type ProductTypeListResponse = {
    items: ProductTypeResponse[];
};
