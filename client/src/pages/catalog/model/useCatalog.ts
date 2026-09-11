import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getProducts, type GetProductsParams } from '@/entities/product';
import { useLocale } from '@/entities/locale';

export const catalogQueryKeys = {
    all: ['products'] as const,

    list: (params: GetProductsParams) =>
        [...catalogQueryKeys.all, 'list', params] as const,
};

export const useCatalog = (params: GetProductsParams = {}) => {
    const { language, currency } = useLocale();

    const queryParams: GetProductsParams = {
        ...params,
        language,
        currency,
    };

    return useQuery({
        queryKey: catalogQueryKeys.list(queryParams),

        queryFn: () => getProducts(queryParams),

        placeholderData: keepPreviousData,
    });
};
