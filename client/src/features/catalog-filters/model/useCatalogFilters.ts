import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { CatalogFilters } from './types';

const DEFAULT_FILTERS: CatalogFilters = {
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
};

const VALID_SORTS: CatalogFilters['sort'][] = [
    'newest',
    'oldest',
    'price_asc',
    'price_desc',
    'name_asc',
    'name_desc',
];

const getFiltersFromSearchParams = (
    searchParams: URLSearchParams,
): CatalogFilters => {
    const sort = searchParams.get('sort');

    return {
        search: searchParams.get('search') ?? '',
        category: searchParams.get('category') ?? '',
        minPrice: searchParams.get('minPrice') ?? '',
        maxPrice: searchParams.get('maxPrice') ?? '',
        sort: VALID_SORTS.includes(sort as CatalogFilters['sort'])
            ? (sort as CatalogFilters['sort'])
            : DEFAULT_FILTERS.sort,
    };
};

const buildSearchParams = (filters: CatalogFilters) => {
    const params = new URLSearchParams();

    const search = filters.search.trim();
    const category = filters.category.trim();
    const minPrice = filters.minPrice.trim();
    const maxPrice = filters.maxPrice.trim();

    if (search) {
        params.set('search', search);
    }

    if (category) {
        params.set('category', category);
    }

    if (minPrice) {
        params.set('minPrice', minPrice);
    }

    if (maxPrice) {
        params.set('maxPrice', maxPrice);
    }

    if (filters.sort !== DEFAULT_FILTERS.sort) {
        params.set('sort', filters.sort);
    }

    return params;
};

export const useCatalogFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = useMemo(
        () => getFiltersFromSearchParams(searchParams),
        [searchParams],
    );

    const updateFilters = useCallback(
        (nextFilters: Partial<CatalogFilters>) => {
            const nextFiltersState: CatalogFilters = {
                ...filters,
                ...nextFilters,
            };

            setSearchParams(buildSearchParams(nextFiltersState), {
                replace: true,
            });
        },
        [filters, setSearchParams],
    );

    const resetFilters = useCallback(() => {
        setSearchParams(
            {},
            {
                replace: true,
            },
        );
    }, [setSearchParams]);

    return {
        filters,
        updateFilters,
        resetFilters,
    };
};
