import { useTranslation } from 'react-i18next';

import { ProductGrid } from '@/entities/product';
import { CatalogFilters, useCatalogFilters } from '@/features/catalog-filters';

import { useCatalog } from '../model/useCatalog';

import styles from './CatalogPage.module.scss';

export const CatalogPage = () => {
    const { t } = useTranslation();

    const { filters, updateFilters, resetFilters } = useCatalogFilters();

    const { data, isLoading, isError } = useCatalog({
        page: 1,
        limit: 20,
        search: filters.search || undefined,
        category: filters.category || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        sort: filters.sort,
    });

    if (isLoading) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <p>{t('catalog.loading')}</p>
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <p>{t('catalog.error')}</p>
                </div>
            </main>
        );
    }

    const products = data?.items ?? [];

    return (
        <main className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <p className={styles.eyebrow}>{t('catalog.eyebrow')}</p>

                    <h1 className={styles.title}>{t('catalog.title')}</h1>

                    <p className={styles.description}>
                        {t('catalog.description')}
                    </p>
                </header>

                <CatalogFilters
                    filters={filters}
                    onChange={updateFilters}
                    onReset={resetFilters}
                />

                {products.length > 0 ? (
                    <ProductGrid products={products} />
                ) : (
                    <div className={styles.empty}>
                        <p>{t('catalog.empty')}</p>
                    </div>
                )}
            </div>
        </main>
    );
};
