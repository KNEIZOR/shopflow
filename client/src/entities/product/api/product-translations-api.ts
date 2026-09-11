import { apiRequest } from '@/shared/api';

export type ProductTranslation = {
    id: string;
    productId: string;
    language: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
};

export type ProductTranslationsResponse = {
    items: ProductTranslation[];
};

export type UpsertProductTranslationInput = {
    name: string;
    description?: string | null;
};

export const getProductTranslations = async (
    productId: string,
): Promise<ProductTranslationsResponse> => {
    const response = await apiRequest<{
        translations: ProductTranslation[];
    }>(`/products/admin/${productId}/translations`);

    return {
        items: response.translations,
    };
};

export const getProductTranslation = async (
    productId: string,
    language: string,
): Promise<ProductTranslation> => {
    const response = await apiRequest<{
        translation: ProductTranslation;
    }>(`/products/admin/${productId}/translations/${language}`);

    return response.translation;
};

export const upsertProductTranslation = async (
    productId: string,
    language: string,
    input: UpsertProductTranslationInput,
): Promise<ProductTranslation> => {
    const response = await apiRequest<{
        translation: ProductTranslation;
    }>(`/products/admin/${productId}/translations/${language}`, {
        method: 'PUT',
        body: JSON.stringify(input),
    });

    return response.translation;
};

export const deleteProductTranslation = async (
    productId: string,
    language: string,
): Promise<void> => {
    await apiRequest<void>(
        `/products/admin/${productId}/translations/${language}`,
        {
            method: 'DELETE',
        },
    );
};
