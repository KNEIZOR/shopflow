import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useParams } from 'react-router-dom';

import { getAdminProductBySlug } from '@/entities/product';

import { useLocale } from '@/entities/locale';

import { adminProductQueryKeys } from './admin-product-query-keys';

export const useAdminProduct = () => {
    const { slug } = useParams<{
        slug: string;
    }>();

    const { language, currency } = useLocale();

    return useQuery({
        queryKey: slug
            ? adminProductQueryKeys.detail(slug, language, currency)
            : [...adminProductQueryKeys.all, 'detail', 'missing'],

        queryFn: () => {
            if (!slug) {
                throw new Error('Product slug is required');
            }

            return getAdminProductBySlug(slug, {
                language,
                currency,
            });
        },

        enabled: Boolean(slug),

        placeholderData: keepPreviousData,
    });
};
