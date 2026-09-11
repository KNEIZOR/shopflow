import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getProductBySlug } from '@/entities/product';
import { useLocale } from '@/entities/locale';

export const productQueryKeys = {
    all: ['product'] as const,

    detail: (slug: string, language: string, currency: string) =>
        [...productQueryKeys.all, 'detail', slug, language, currency] as const,
};

export const useProduct = () => {
    const { slug } = useParams<{
        slug: string;
    }>();

    const { language, currency } = useLocale();

    return useQuery({
        queryKey: slug
            ? productQueryKeys.detail(slug, language, currency)
            : [...productQueryKeys.all, 'detail', 'missing'],

        queryFn: () => {
            if (!slug) {
                throw new Error('Product slug is required');
            }

            return getProductBySlug(slug, {
                language,
                currency,
            });
        },

        enabled: Boolean(slug),

        placeholderData: keepPreviousData,
    });
};
