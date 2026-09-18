import { apiRequest } from '@/shared/api';

import type {
    CreateProductTypeAttributeInput,
    CreateProductTypeInput,
    CreateProductTypeOptionInput,
    ProductType,
    ProductTypeAttribute,
    ProductTypeAttributeOption,
    ProductTypeListResponse,
    UpdateProductTypeAttributeInput,
    UpdateProductTypeInput,
    UpdateProductTypeOptionInput,
} from '../model/types';

/**
 * Product types
 */

export const getProductTypes = async (): Promise<ProductTypeListResponse> => {
    const response = await apiRequest<{
        success: boolean;
        productTypes: ProductType[];
    }>('/product-types');

    return {
        items: response.productTypes,
    };
};

export const getProductTypeBySlug = async (
    slug: string,
): Promise<ProductType> => {
    const response = await apiRequest<{
        success: boolean;
        productType: ProductType;
    }>(`/product-types/slug/${slug}`);

    return response.productType;
};

export const getProductTypeById = async (id: string): Promise<ProductType> => {
    const response = await apiRequest<{
        success: boolean;
        productType: ProductType;
    }>(`/product-types/id/${id}`);

    return response.productType;
};

export const createProductType = async (
    input: CreateProductTypeInput,
): Promise<ProductType> => {
    const response = await apiRequest<{
        success: boolean;
        productType: ProductType;
    }>('/product-types', {
        method: 'POST',
        body: JSON.stringify(input),
    });

    return response.productType;
};

export const updateProductType = async (
    id: string,
    input: UpdateProductTypeInput,
): Promise<ProductType> => {
    const response = await apiRequest<{
        success: boolean;
        productType: ProductType;
    }>(`/product-types/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
    });

    return response.productType;
};

export const deleteProductType = async (id: string): Promise<void> => {
    await apiRequest<unknown>(`/product-types/${id}`, {
        method: 'DELETE',
    });
};

/**
 * Product type attributes
 */

export const getProductTypeAttributes = async (
    productTypeId: string,
): Promise<ProductTypeAttribute[]> => {
    const response = await apiRequest<{
        success: boolean;
        attributes: ProductTypeAttribute[];
    }>(`/product-types/${productTypeId}/attributes`);

    return response.attributes;
};

export const getProductTypeAttributeById = async (
    productTypeId: string,
    attributeId: string,
): Promise<ProductTypeAttribute> => {
    const response = await apiRequest<{
        success: boolean;
        attribute: ProductTypeAttribute;
    }>(`/product-types/${productTypeId}/attributes/${attributeId}`);

    return response.attribute;
};

export const createProductTypeAttribute = async (
    productTypeId: string,
    input: CreateProductTypeAttributeInput,
): Promise<ProductTypeAttribute> => {
    const response = await apiRequest<{
        success: boolean;
        attribute: ProductTypeAttribute;
    }>(`/product-types/${productTypeId}/attributes`, {
        method: 'POST',
        body: JSON.stringify(input),
    });

    return response.attribute;
};

export const updateProductTypeAttribute = async (
    productTypeId: string,
    attributeId: string,
    input: UpdateProductTypeAttributeInput,
): Promise<ProductTypeAttribute> => {
    const response = await apiRequest<{
        success: boolean;
        attribute: ProductTypeAttribute;
    }>(`/product-types/${productTypeId}/attributes/${attributeId}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
    });

    return response.attribute;
};

export const deleteProductTypeAttribute = async (
    productTypeId: string,
    attributeId: string,
): Promise<void> => {
    await apiRequest<unknown>(
        `/product-types/${productTypeId}/attributes/${attributeId}`,
        {
            method: 'DELETE',
        },
    );
};

/**
 * Product type attribute options
 */

export const getProductTypeOptions = async (
    productTypeId: string,
    attributeId: string,
): Promise<ProductTypeAttributeOption[]> => {
    const response = await apiRequest<{
        success: boolean;
        options: ProductTypeAttributeOption[];
    }>(`/product-types/${productTypeId}/attributes/${attributeId}/options`);

    return response.options;
};

export const createProductTypeOption = async (
    productTypeId: string,
    attributeId: string,
    input: CreateProductTypeOptionInput,
): Promise<ProductTypeAttributeOption> => {
    const response = await apiRequest<{
        success: boolean;
        option: ProductTypeAttributeOption;
    }>(`/product-types/${productTypeId}/attributes/${attributeId}/options`, {
        method: 'POST',
        body: JSON.stringify(input),
    });

    return response.option;
};

export const updateProductTypeOption = async (
    productTypeId: string,
    attributeId: string,
    optionId: string,
    input: UpdateProductTypeOptionInput,
): Promise<ProductTypeAttributeOption> => {
    const response = await apiRequest<{
        success: boolean;
        option: ProductTypeAttributeOption;
    }>(
        `/product-types/${productTypeId}/attributes/${attributeId}/options/${optionId}`,
        {
            method: 'PATCH',
            body: JSON.stringify(input),
        },
    );

    return response.option;
};

export const deleteProductTypeOption = async (
    productTypeId: string,
    attributeId: string,
    optionId: string,
): Promise<void> => {
    await apiRequest<unknown>(
        `/product-types/${productTypeId}/attributes/${attributeId}/options/${optionId}`,
        {
            method: 'DELETE',
        },
    );
};
