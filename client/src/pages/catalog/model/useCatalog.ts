import { useInfiniteQuery } from '@tanstack/react-query';

import { getProducts, type GetProductsParams } from '@/entities/product';
import { useLocale } from '@/entities/locale';

export const catalogQueryKeys = {
    all: ['products'] as const,

    list: (params: GetProductsParams) =>
        [...catalogQueryKeys.all, 'list', params] as const,
};

const CATALOG_PAGE_SIZE = 12;

type UseCatalogParams = Omit<
    GetProductsParams,
    'page' | 'limit' | 'excludeIds'
>;

type CatalogPageParam = {
    page: number;
    excludeIds: string[];
};

export const useCatalog = (params: UseCatalogParams = {}) => {
    const { language, currency } = useLocale();

    const queryParams: UseCatalogParams = {
        ...params,
        language,
        currency,
    };

    /*
     * Random mode is used only for the default "newest" catalog.
     *
     * Explicit sorting modes remain deterministic and are handled
     * by the backend.
     */
    const shouldUseRandom = !queryParams.sort || queryParams.sort === 'newest';

    const initialPageParam: CatalogPageParam = {
        page: 1,
        excludeIds: [],
    };

    return useInfiniteQuery({
        queryKey: catalogQueryKeys.list(queryParams),

        initialPageParam,

        queryFn: ({ pageParam }) => {
            return getProducts({
                ...queryParams,

                page: pageParam.page,

                limit: CATALOG_PAGE_SIZE,

                random: shouldUseRandom,

                excludeIds: shouldUseRandom ? pageParam.excludeIds : [],
            });
        },

        getNextPageParam: (lastPage, allPages) => {
            const loadedCount = allPages.reduce(
                (total, page) => total + page.items.length,
                0,
            );

            /*
             * Stop when every matching product has already been loaded.
             */
            if (loadedCount >= lastPage.pagination.total) {
                return undefined;
            }

            /*
             * Collect all displayed product IDs.
             *
             * Random mode sends these IDs to the backend so that
             * subsequent requests cannot return duplicates.
             */
            const excludeIds = allPages.flatMap((page) =>
                page.items.map((product) => product.id),
            );

            return {
                page: allPages.length + 1,
                excludeIds,
            };
        },
    });
};
