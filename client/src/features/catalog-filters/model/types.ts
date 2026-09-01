export type CatalogFilters = {
    search: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    sort:
        | 'newest'
        | 'oldest'
        | 'price_asc'
        | 'price_desc'
        | 'name_asc'
        | 'name_desc';
};
