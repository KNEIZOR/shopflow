import { useTranslation } from 'react-i18next';

import type { AdminOrdersPagination as Pagination } from '../../model/admin-orders.types';

import styles from '../../AdminOrdersPage.module.scss';

interface AdminOrdersPaginationProps {
    pagination?: Pagination;
    onPageChange: (value: number | ((currentPage: number) => number)) => void;
}

export const AdminOrdersPagination = ({
    pagination,
    onPageChange,
}: AdminOrdersPaginationProps) => {
    const { t } = useTranslation();

    if (!pagination || pagination.totalPages <= 1) {
        return null;
    }

    return (
        <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
                {t('admin.orders.pagination.page', {
                    page: pagination.page,
                    totalPages: pagination.totalPages,
                })}
            </span>

            <div className={styles.paginationControls}>
                <button
                    type="button"
                    disabled={!pagination.hasPreviousPage}
                    onClick={() =>
                        onPageChange((currentPage) =>
                            Math.max(1, currentPage - 1),
                        )
                    }
                    className={styles.pageButton}
                >
                    {t('admin.orders.pagination.previous')}
                </button>

                <span className={styles.currentPage}>{pagination.page}</span>

                <button
                    type="button"
                    disabled={!pagination.hasNextPage}
                    onClick={() =>
                        onPageChange((currentPage) =>
                            Math.min(pagination.totalPages, currentPage + 1),
                        )
                    }
                    className={styles.pageButton}
                >
                    {t('admin.orders.pagination.next')}
                </button>
            </div>
        </div>
    );
};
