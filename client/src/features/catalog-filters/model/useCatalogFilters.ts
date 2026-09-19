import { useCallback, useMemo, useState } from 'react';
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

    if (filters.search) {
        params.set('search', filters.search);
    }

    if (filters.category) {
        params.set('category', filters.category);
    }

    if (filters.minPrice) {
        params.set('minPrice', filters.minPrice);
    }

    if (filters.maxPrice) {
        params.set('maxPrice', filters.maxPrice);
    }

    if (filters.sort !== DEFAULT_FILTERS.sort) {
        params.set('sort', filters.sort);
    }

    return params;
};

export const useCatalogFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const initialFilters = useMemo(
        () => getFiltersFromSearchParams(searchParams),
        [searchParams],
    );

    const [filters, setFilters] = useState<CatalogFilters>(initialFilters);

    const updateFilters = useCallback(
        (nextFilters: Partial<CatalogFilters>) => {
            setFilters((currentFilters) => {
                const next: CatalogFilters = {
                    ...currentFilters,
                    ...nextFilters,
                };

                setSearchParams(buildSearchParams(next));

                return next;
            });
        },
        [setSearchParams],
    );

    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
        setSearchParams({});
    }, [setSearchParams]);

    return {
        filters,
        updateFilters,
        resetFilters,
    };
};
