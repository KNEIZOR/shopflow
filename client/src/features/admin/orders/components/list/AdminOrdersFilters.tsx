import { useTranslation } from 'react-i18next';

import {
    ADMIN_ORDER_SORT_OPTIONS,
    ADMIN_ORDER_STATUS_OPTIONS,
    ADMIN_PAYMENT_STATUS_OPTIONS,
} from '../../model/admin-orders.constants';
import type {
    AdminOrderSort,
    AdminOrderStatus,
    AdminPaymentStatus,
} from '../../model/admin-orders.types';

import styles from '../../AdminOrdersPage.module.scss';

interface AdminOrdersFiltersProps {
    search: string;
    status: AdminOrderStatus | '';
    paymentStatus: AdminPaymentStatus | '';
    sort: AdminOrderSort;

    onSearchChange: (value: string) => void;
    onStatusChange: (value: AdminOrderStatus | '') => void;
    onPaymentStatusChange: (value: AdminPaymentStatus | '') => void;
    onSortChange: (value: AdminOrderSort) => void;
}

export const AdminOrdersFilters = ({
    search,
    status,
    paymentStatus,
    sort,
    onSearchChange,
    onStatusChange,
    onPaymentStatusChange,
    onSortChange,
}: AdminOrdersFiltersProps) => {
    const { t } = useTranslation();

    return (
        <section className={styles.toolbar}>
            <div className={styles.searchField}>
                <label htmlFor="admin-order-search" className={styles.label}>
                    {t('admin.orders.filters.title')}
                </label>

                <input
                    id="admin-order-search"
                    type="search"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={t('admin.orders.search.placeholder')}
                    className={styles.input}
                    autoComplete="off"
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="admin-order-status" className={styles.label}>
                    {t('admin.orders.filters.status')}
                </label>

                <select
                    id="admin-order-status"
                    value={status}
                    onChange={(event) =>
                        onStatusChange(
                            event.target.value as AdminOrderStatus | '',
                        )
                    }
                    className={styles.select}
                >
                    {ADMIN_ORDER_STATUS_OPTIONS.map((option) => (
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
                <label
                    htmlFor="admin-order-payment-status"
                    className={styles.label}
                >
                    {t('admin.orders.filters.paymentStatus')}
                </label>

                <select
                    id="admin-order-payment-status"
                    value={paymentStatus}
                    onChange={(event) =>
                        onPaymentStatusChange(
                            event.target.value as AdminPaymentStatus | '',
                        )
                    }
                    className={styles.select}
                >
                    {ADMIN_PAYMENT_STATUS_OPTIONS.map((option) => (
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
                <label htmlFor="admin-order-sort" className={styles.label}>
                    {t('admin.orders.filters.sort')}
                </label>

                <select
                    id="admin-order-sort"
                    value={sort}
                    onChange={(event) =>
                        onSortChange(event.target.value as AdminOrderSort)
                    }
                    className={styles.select}
                >
                    {ADMIN_ORDER_SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {t(option.labelKey)}
                        </option>
                    ))}
                </select>
            </div>
        </section>
    );
};
