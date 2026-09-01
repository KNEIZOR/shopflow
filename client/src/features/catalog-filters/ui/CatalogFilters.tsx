import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import type { CatalogFilters as CatalogFiltersState } from '../model/types';

import styles from './CatalogFilters.module.scss';

type CatalogFiltersProps = {
    filters: CatalogFiltersState;
    onChange: (filters: Partial<CatalogFiltersState>) => void;
    onReset: () => void;
};

const isValidPriceInput = (value: string) => {
    return /^\d*(?:[.,]\d{0,2})?$/.test(value);
};

const normalizePriceInput = (value: string) => {
    return value.replace(',', '.');
};

export const CatalogFilters = ({
    filters,
    onChange,
    onReset,
}: CatalogFiltersProps) => {
    const { t } = useTranslation();

    const searchTimeoutRef = useRef<number | null>(null);
    const minPriceTimeoutRef = useRef<number | null>(null);
    const maxPriceTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current !== null) {
                window.clearTimeout(searchTimeoutRef.current);
            }

            if (minPriceTimeoutRef.current !== null) {
                window.clearTimeout(minPriceTimeoutRef.current);
            }

            if (maxPriceTimeoutRef.current !== null) {
                window.clearTimeout(maxPriceTimeoutRef.current);
            }
        };
    }, []);

    const handleSearchChange = (value: string) => {
        if (searchTimeoutRef.current !== null) {
            window.clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = window.setTimeout(() => {
            onChange({
                search: value,
            });
        }, 300);
    };

    const handleMinPriceChange = (value: string) => {
        const normalizedValue = normalizePriceInput(value);

        if (!isValidPriceInput(normalizedValue)) {
            return;
        }

        if (minPriceTimeoutRef.current !== null) {
            window.clearTimeout(minPriceTimeoutRef.current);
        }

        minPriceTimeoutRef.current = window.setTimeout(() => {
            onChange({
                minPrice: normalizedValue,
            });
        }, 500);
    };

    const handleMaxPriceChange = (value: string) => {
        const normalizedValue = normalizePriceInput(value);

        if (!isValidPriceInput(normalizedValue)) {
            return;
        }

        if (maxPriceTimeoutRef.current !== null) {
            window.clearTimeout(maxPriceTimeoutRef.current);
        }

        maxPriceTimeoutRef.current = window.setTimeout(() => {
            onChange({
                maxPrice: normalizedValue,
            });
        }, 500);
    };

    return (
        <section className={styles.filters}>
            <div className={styles.search}>
                <label htmlFor="catalog-search">
                    {t('catalog.filters.search')}
                </label>

                <input
                    id="catalog-search"
                    type="search"
                    value={filters.search}
                    placeholder={t('catalog.filters.searchPlaceholder')}
                    onChange={(event) => {
                        handleSearchChange(event.target.value);
                    }}
                />
            </div>

            <div className={styles.price}>
                <div className={styles.priceField}>
                    <label htmlFor="catalog-min-price">
                        {t('catalog.filters.minPrice')}
                    </label>

                    <input
                        id="catalog-min-price"
                        type="text"
                        inputMode="decimal"
                        value={filters.minPrice}
                        placeholder="0.00"
                        onChange={(event) => {
                            handleMinPriceChange(event.target.value);
                        }}
                    />
                </div>

                <div className={styles.priceField}>
                    <label htmlFor="catalog-max-price">
                        {t('catalog.filters.maxPrice')}
                    </label>

                    <input
                        id="catalog-max-price"
                        type="text"
                        inputMode="decimal"
                        value={filters.maxPrice}
                        placeholder="0.00"
                        onChange={(event) => {
                            handleMaxPriceChange(event.target.value);
                        }}
                    />
                </div>
            </div>

            <div className={styles.sort}>
                <label htmlFor="catalog-sort">
                    {t('catalog.filters.sort')}
                </label>

                <select
                    id="catalog-sort"
                    value={filters.sort}
                    onChange={(event) => {
                        onChange({
                            sort: event.target
                                .value as CatalogFiltersState['sort'],
                        });
                    }}
                >
                    <option value="newest">
                        {t('catalog.filters.newest')}
                    </option>

                    <option value="oldest">
                        {t('catalog.filters.oldest')}
                    </option>

                    <option value="price_asc">
                        {t('catalog.filters.priceAsc')}
                    </option>

                    <option value="price_desc">
                        {t('catalog.filters.priceDesc')}
                    </option>

                    <option value="name_asc">
                        {t('catalog.filters.nameAsc')}
                    </option>

                    <option value="name_desc">
                        {t('catalog.filters.nameDesc')}
                    </option>
                </select>
            </div>

            <button type="button" className={styles.reset} onClick={onReset}>
                {t('catalog.filters.reset')}
            </button>
        </section>
    );
};
