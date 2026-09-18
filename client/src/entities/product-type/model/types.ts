export type ProductAttributeType = 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT';

export type ProductAttributeScope = 'PRODUCT' | 'VARIANT' | 'BOTH';

export type ProductTypeAttributeOption = {
    id: string;
    value: string;
    label: string;
    position: number;
};

export type ProductTypeAttribute = {
    id: string;
    attributeId: string;
    name: string;
    slug: string;
    description: string | null;
    type: ProductAttributeType;
    scope: ProductAttributeScope;
    isRequired: boolean;
    position: number;
    options: ProductTypeAttributeOption[];
};

export type ProductType = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    attributes: ProductTypeAttribute[];
    createdAt: string;
    updatedAt: string;
};

export type ProductTypeListResponse = {
    items: ProductType[];
};

export type CreateProductTypeInput = {
    name: string;
    slug: string;
    description?: string;
};

export type UpdateProductTypeInput = {
    name?: string;
    slug?: string;
    description?: string;
};

export type CreateProductTypeAttributeInput = {
    name: string;
    slug: string;
    description?: string;
    type: ProductAttributeType;
    scope?: ProductAttributeScope;
    isRequired?: boolean;
    position?: number;
};

export type UpdateProductTypeAttributeInput = {
    name?: string;
    slug?: string;
    description?: string;
    type?: ProductAttributeType;
    scope?: ProductAttributeScope;
    isRequired?: boolean;
    position?: number;
};

export type CreateProductTypeOptionInput = {
    value: string;
    label: string;
    position?: number;
};

export type UpdateProductTypeOptionInput = {
    value?: string;
    label?: string;
    position?: number;
};
