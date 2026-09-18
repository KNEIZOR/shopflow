import { useQuery } from '@tanstack/react-query';

import { getProductTypes } from '@/entities/product-type';

import { productTypeQueryKeys } from './product-type-query-keys';

export const useProductTypes = () => {
    return useQuery({
        queryKey: productTypeQueryKeys.list(),
        queryFn: getProductTypes,
        staleTime: 5 * 60 * 1000,
    });
};
