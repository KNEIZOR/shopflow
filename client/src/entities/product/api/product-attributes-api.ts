import { apiRequest } from '@/shared/api';

export type ProductAttributeValue = {
    id: string;
    attributeId: string;
    value: string | number | boolean;
};

export type ProductAttributesResponse = {
    items: ProductAttributeValue[];
};

export type CreateProductAttributeValueInput = {
    attributeId: string;
    value: string | number | boolean;
};

export type UpdateProductAttributeValueInput = {
    value: string | number | boolean;
};

export const getProductAttributes = async (
    productId: string,
): Promise<ProductAttributesResponse> => {
    const response = await apiRequest<{
        success: boolean;
        attributes: ProductAttributeValue[];
    }>(`/products/admin/${productId}/attributes`);

    return {
        items: response.attributes,
    };
};

export const createProductAttributeValue = async (
    productId: string,
    input: CreateProductAttributeValueInput,
): Promise<ProductAttributeValue> => {
    const response = await apiRequest<{
        success: boolean;
        attribute: ProductAttributeValue;
    }>(`/products/admin/${productId}/attributes`, {
        method: 'POST',
        body: JSON.stringify(input),
    });

    return response.attribute;
};

export const updateProductAttributeValue = async (
    productId: string,
    attributeId: string,
    input: UpdateProductAttributeValueInput,
): Promise<ProductAttributeValue> => {
    const response = await apiRequest<{
        success: boolean;
        attribute: ProductAttributeValue;
    }>(`/products/admin/${productId}/attributes/${attributeId}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
    });

    return response.attribute;
};

export const deleteProductAttributeValue = async (
    productId: string,
    attributeId: string,
): Promise<void> => {
    await apiRequest<void>(
        `/products/admin/${productId}/attributes/${attributeId}`,
        {
            method: 'DELETE',
        },
    );
};
