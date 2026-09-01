import { useQuery } from '@tanstack/react-query';

import { getProducts, type GetProductsParams } from '@/entities/product';

export const catalogQueryKeys = {
    all: ['products'] as const,

    list: (params: GetProductsParams) =>
        [...catalogQueryKeys.all, 'list', params] as const,
};

export const useCatalog = (params: GetProductsParams = {}) => {
    return useQuery({
        queryKey: catalogQueryKeys.list(params),
        queryFn: () => getProducts(params),
    });
};
