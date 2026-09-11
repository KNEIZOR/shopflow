import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
    getAdminProducts,
    type GetAdminProductsParams,
} from '@/entities/product';

import { useLocale } from '@/entities/locale';

import { adminProductQueryKeys } from './admin-product-query-keys';

export const useAdminProducts = (params: GetAdminProductsParams = {}) => {
    const { language, currency } = useLocale();

    const queryParams = {
        ...params,
        language,
        currency,
    };

    return useQuery({
        queryKey: adminProductQueryKeys.list(queryParams),

        queryFn: () => getAdminProducts(queryParams),

        placeholderData: keepPreviousData,
    });
};
