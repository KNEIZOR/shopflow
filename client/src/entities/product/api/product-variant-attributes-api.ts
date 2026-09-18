import { apiRequest } from '@/shared/api';

export type ProductVariantAttributeValue = {
    id: string;
    variantId: string;
    attributeId: string;
    value: string | number | boolean;
};

export type ProductVariantAttributesResponse = {
    items: ProductVariantAttributeValue[];
};

export type CreateProductVariantAttributeValueInput = {
    attributeId: string;
    value: string | number | boolean;
};

export type UpdateProductVariantAttributeValueInput = {
    value: string | number | boolean;
};

export const getProductVariantAttributes = async (
    productId: string,
    variantId: string,
): Promise<ProductVariantAttributesResponse> => {
    const response = await apiRequest<{
        success: boolean;
        attributes: ProductVariantAttributeValue[];
    }>(`/products/admin/${productId}/variants/${variantId}/attributes`);

    return {
        items: response.attributes,
    };
};

export const createProductVariantAttributeValue = async (
    productId: string,
    variantId: string,
    input: CreateProductVariantAttributeValueInput,
): Promise<ProductVariantAttributeValue> => {
    const response = await apiRequest<{
        success: boolean;
        attribute: ProductVariantAttributeValue;
    }>(`/products/admin/${productId}/variants/${variantId}/attributes`, {
        method: 'POST',
        body: JSON.stringify(input),
    });

    return response.attribute;
};

export const updateProductVariantAttributeValue = async (
    productId: string,
    variantId: string,
    attributeId: string,
    input: UpdateProductVariantAttributeValueInput,
): Promise<ProductVariantAttributeValue> => {
    const response = await apiRequest<{
        success: boolean;
        attribute: ProductVariantAttributeValue;
    }>(
        `/products/admin/${productId}/variants/${variantId}/attributes/${attributeId}`,
        {
            method: 'PATCH',
            body: JSON.stringify(input),
        },
    );

    return response.attribute;
};

export const deleteProductVariantAttributeValue = async (
    productId: string,
    variantId: string,
    attributeId: string,
): Promise<void> => {
    await apiRequest<void>(
        `/products/admin/${productId}/variants/${variantId}/attributes/${attributeId}`,
        {
            method: 'DELETE',
        },
    );
};
