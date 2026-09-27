import { useTranslation } from 'react-i18next';

import { useLocale } from '@/entities/locale';

import { useAdminOrders, useAdminOrdersFilters } from '@/features/admin/orders';

import { AdminOrdersFilters } from './components/list/AdminOrdersFilters';
import { AdminOrdersPagination } from './components/list/AdminOrdersPagination';
import { AdminOrdersTable } from './components/list/AdminOrdersTable';

import styles from './AdminOrdersPage.module.scss';

export const AdminOrdersPage = () => {
    const { t } = useTranslation();
    const { language } = useLocale();

    const filters = useAdminOrdersFilters();

    const ordersQuery = useAdminOrders(filters.query);

    const orders = ordersQuery.data?.items ?? [];

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>
                        {t('admin.orders.table.order')}
                    </p>

                    <h1 className={styles.title}>{t('admin.orders.title')}</h1>

                    <p className={styles.description}>
                        {t('admin.orders.subtitle')}
                    </p>
                </div>
            </header>

            <AdminOrdersFilters
                search={filters.search}
                status={filters.status}
                paymentStatus={filters.paymentStatus}
                sort={filters.sort}
                onSearchChange={filters.setSearch}
                onStatusChange={filters.setStatus}
                onPaymentStatusChange={filters.setPaymentStatus}
                onSortChange={filters.setSort}
            />

            <section className={styles.card}>
                {ordersQuery.isLoading ? (
                    <div className={styles.state}>{t('common.loading')}</div>
                ) : ordersQuery.isError ? (
                    <div className={styles.state}>
                        {t('admin.orders.error.description')}
                    </div>
                ) : orders.length === 0 ? (
                    <div className={styles.empty}>
                        <h2 className={styles.emptyTitle}>
                            {t('admin.orders.empty.title')}
                        </h2>

                        <p className={styles.emptyDescription}>
                            {t('admin.orders.empty.description')}
                        </p>
                    </div>
                ) : (
                    <>
                        <AdminOrdersTable orders={orders} language={language} />

                        <AdminOrdersPagination
                            pagination={ordersQuery.data?.pagination}
                            onPageChange={filters.setPage}
                        />
                    </>
                )}
            </section>
        </section>
    );
};
