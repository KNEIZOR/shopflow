import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
    useAdminProducts,
    useDeleteProduct,
} from '@/features/admin/product/model';

import { useCategories } from '@/entities/category';
import { useLocale } from '@/entities/locale';
import type { GetAdminProductsParams, ProductStatus } from '@/entities/product';

import { useToast } from '@/shared/ui/Toast';

import styles from './ProductsAdminPage.module.scss';

type SortOption = NonNullable<GetAdminProductsParams['sort']>;

const PAGE_SIZE = 10;

const SORT_OPTIONS: ReadonlyArray<{
    value: SortOption;
    labelKey: string;
}> = [
    {
        value: 'newest',
        labelKey: 'admin.products.list.sort.newest',
    },
    {
        value: 'oldest',
        labelKey: 'admin.products.list.sort.oldest',
    },
    {
        value: 'price_asc',
        labelKey: 'admin.products.list.sort.priceAsc',
    },
    {
        value: 'price_desc',
        labelKey: 'admin.products.list.sort.priceDesc',
    },
    {
        value: 'name_asc',
        labelKey: 'admin.products.list.sort.nameAsc',
    },
    {
        value: 'name_desc',
        labelKey: 'admin.products.list.sort.nameDesc',
    },
];

const STATUS_OPTIONS: ReadonlyArray<{
    value: ProductStatus | '';
    labelKey: string;
}> = [
    {
        value: '',
        labelKey: 'admin.products.list.filters.allStatuses',
    },
    {
        value: 'ACTIVE',
        labelKey: 'admin.products.status.active',
    },
    {
        value: 'DRAFT',
        labelKey: 'admin.products.status.draft',
    },
    {
        value: 'ARCHIVED',
        labelKey: 'admin.products.status.archived',
    },
];

const getStatusClassName = (
    status: ProductStatus,
    stylesMap: Record<string, string>,
) => {
    return stylesMap[`status${status}`] ?? stylesMap.statusDefault;
};

export const ProductsAdminPage = () => {
    const { t } = useTranslation();
    const { language } = useLocale();
    const { showToast } = useToast();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState<ProductStatus | ''>('');
    const [sort, setSort] = useState<SortOption>('newest');
    const [page, setPage] = useState(1);
    const [deletingProductId, setDeletingProductId] = useState<string | null>(
        null,
    );

    const categoriesQuery = useCategories(language);

    const queryParams = useMemo<GetAdminProductsParams>(
        () => ({
            page,
            limit: PAGE_SIZE,
            search: search.trim() || undefined,
            category: category || undefined,
            status: status || undefined,
            sort,
        }),
        [page, search, category, status, sort],
    );

    const productsQuery = useAdminProducts(queryParams);
    const deleteProductMutation = useDeleteProduct();

    const products = productsQuery.data?.items ?? [];
    const pagination = productsQuery.data?.pagination;

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        setPage(1);
    };

    const handleStatusChange = (value: ProductStatus | '') => {
        setStatus(value);
        setPage(1);
    };

    const handleSortChange = (value: SortOption) => {
        setSort(value);
        setPage(1);
    };

    const handleDelete = async (productId: string, productName: string) => {
        const confirmed = window.confirm(
            t('admin.products.list.deleteConfirm', {
                name: productName,
            }),
        );

        if (!confirmed) {
            return;
        }

        setDeletingProductId(productId);

        try {
            await deleteProductMutation.mutateAsync(productId);

            showToast({
                type: 'success',
                message: t('admin.products.list.deleteSuccess'),
            });

            if (products.length === 1 && page > 1) {
                setPage((currentPage) => Math.max(1, currentPage - 1));
            }
        } catch (error) {
            showToast({
                type: 'error',
                message:
                    error instanceof Error ? error.message : t('common.error'),
            });
        } finally {
            setDeletingProductId(null);
        }
    };

    const hasProducts = products.length > 0;
    const totalPages = pagination?.totalPages ?? 0;

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>
                        {t('admin.products.list.eyebrow')}
                    </p>

                    <h1 className={styles.title}>
                        {t('admin.products.title')}
                    </h1>

                    <p className={styles.description}>
                        {t('admin.products.list.description')}
                    </p>
                </div>

                <Link to="/admin/products/new" className={styles.createButton}>
                    {t('admin.products.list.create')}
                </Link>
            </header>

            <section className={styles.toolbar}>
                <div className={styles.searchField}>
                    <label htmlFor="product-search" className={styles.label}>
                        {t('admin.products.list.filters.search')}
                    </label>

                    <input
                        id="product-search"
                        type="search"
                        value={search}
                        onChange={(event) =>
                            handleSearchChange(event.target.value)
                        }
                        placeholder={t(
                            'admin.products.list.filters.searchPlaceholder',
                        )}
                        className={styles.input}
                        autoComplete="off"
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="product-category" className={styles.label}>
                        {t('admin.products.list.filters.category')}
                    </label>

                    <select
                        id="product-category"
                        value={category}
                        onChange={(event) =>
                            handleCategoryChange(event.target.value)
                        }
                        className={styles.select}
                        disabled={categoriesQuery.isLoading}
                    >
                        <option value="">
                            {t('admin.products.list.filters.allCategories')}
                        </option>

                        {(categoriesQuery.data ?? []).map((item) => (
                            <option key={item.id} value={item.slug}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label htmlFor="product-status" className={styles.label}>
                        {t('admin.products.list.filters.status')}
                    </label>

                    <select
                        id="product-status"
                        value={status}
                        onChange={(event) =>
                            handleStatusChange(
                                event.target.value as ProductStatus | '',
                            )
                        }
                        className={styles.select}
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option
                                key={option.value || 'all'}
                                value={option.value}
                            >
                                {t(option.labelKey)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label htmlFor="product-sort" className={styles.label}>
                        {t('admin.products.list.filters.sort')}
                    </label>

                    <select
                        id="product-sort"
                        value={sort}
                        onChange={(event) =>
                            handleSortChange(event.target.value as SortOption)
                        }
                        className={styles.select}
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {t(option.labelKey)}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            <section className={styles.card}>
                {productsQuery.isLoading ? (
                    <div className={styles.state}>{t('common.loading')}</div>
                ) : productsQuery.isError ? (
                    <div className={styles.state}>
                        {productsQuery.error instanceof Error
                            ? productsQuery.error.message
                            : t('common.error')}
                    </div>
                ) : !hasProducts ? (
                    <div className={styles.empty}>
                        <h2 className={styles.emptyTitle}>
                            {t('admin.products.list.emptyTitle')}
                        </h2>

                        <p className={styles.emptyDescription}>
                            {t('admin.products.list.emptyDescription')}
                        </p>

                        <Link
                            to="/admin/products/new"
                            className={styles.emptyButton}
                        >
                            {t('admin.products.list.create')}
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>
                                            {t(
                                                'admin.products.list.table.product',
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                'admin.products.list.table.category',
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                'admin.products.list.table.price',
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                'admin.products.list.table.status',
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                'admin.products.list.table.variants',
                                            )}
                                        </th>

                                        <th className={styles.actionsHeader}>
                                            {t(
                                                'admin.products.list.table.actions',
                                            )}
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products.map((product) => {
                                        const image = product.images[0];
                                        const isDeleting =
                                            deletingProductId === product.id;

                                        return (
                                            <tr key={product.id}>
                                                <td>
                                                    <div
                                                        className={
                                                            styles.productCell
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.image
                                                            }
                                                        >
                                                            {image ? (
                                                                <img
                                                                    src={
                                                                        image.url
                                                                    }
                                                                    alt={
                                                                        image.alt ??
                                                                        product.name
                                                                    }
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                />
                                                            ) : (
                                                                <span
                                                                    className={
                                                                        styles.imagePlaceholder
                                                                    }
                                                                    aria-hidden="true"
                                                                >
                                                                    —
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div
                                                            className={
                                                                styles.productInfo
                                                            }
                                                        >
                                                            <strong>
                                                                {product.name}
                                                            </strong>

                                                            <span>
                                                                /{product.slug}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span
                                                        className={
                                                            styles.category
                                                        }
                                                    >
                                                        {product.category.name}
                                                    </span>
                                                </td>

                                                <td>
                                                    <strong
                                                        className={styles.price}
                                                    >
                                                        {product.price}
                                                    </strong>

                                                    <span
                                                        className={
                                                            styles.currency
                                                        }
                                                    >
                                                        {product.currency}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`${styles.status} ${getStatusClassName(
                                                            product.status,
                                                            styles,
                                                        )}`}
                                                    >
                                                        {t(
                                                            `admin.products.status.${product.status.toLowerCase()}`,
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={
                                                            styles.variantCount
                                                        }
                                                    >
                                                        {
                                                            product.variants
                                                                .length
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <div
                                                        className={
                                                            styles.actions
                                                        }
                                                    >
                                                        <Link
                                                            to={`/admin/product/${product.slug}`}
                                                            className={
                                                                styles.editButton
                                                            }
                                                            aria-label={t(
                                                                'admin.products.list.editProduct',
                                                                {
                                                                    name: product.name,
                                                                },
                                                            )}
                                                        >
                                                            {t(
                                                                'admin.products.list.edit',
                                                            )}
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            className={
                                                                styles.deleteButton
                                                            }
                                                            disabled={
                                                                deleteProductMutation.isPending
                                                            }
                                                            onClick={() =>
                                                                void handleDelete(
                                                                    product.id,
                                                                    product.name,
                                                                )
                                                            }
                                                            aria-label={t(
                                                                'admin.products.list.deleteProduct',
                                                                {
                                                                    name: product.name,
                                                                },
                                                            )}
                                                        >
                                                            {isDeleting
                                                                ? t(
                                                                      'admin.products.list.deleting',
                                                                  )
                                                                : t(
                                                                      'admin.products.list.delete',
                                                                  )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {pagination && totalPages > 1 && (
                            <div className={styles.pagination}>
                                <span className={styles.paginationInfo}>
                                    {t('admin.products.list.pagination.info', {
                                        page: pagination.page,
                                        totalPages: pagination.totalPages,
                                        total: pagination.total,
                                    })}
                                </span>

                                <div className={styles.paginationControls}>
                                    <button
                                        type="button"
                                        disabled={page <= 1}
                                        onClick={() =>
                                            setPage((current) =>
                                                Math.max(1, current - 1),
                                            )
                                        }
                                        className={styles.pageButton}
                                    >
                                        {t(
                                            'admin.products.list.pagination.previous',
                                        )}
                                    </button>

                                    <span className={styles.currentPage}>
                                        {pagination.page}
                                    </span>

                                    <button
                                        type="button"
                                        disabled={page >= totalPages}
                                        onClick={() =>
                                            setPage((current) =>
                                                Math.min(
                                                    totalPages,
                                                    current + 1,
                                                ),
                                            )
                                        }
                                        className={styles.pageButton}
                                    >
                                        {t(
                                            'admin.products.list.pagination.next',
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>
        </section>
    );
};
