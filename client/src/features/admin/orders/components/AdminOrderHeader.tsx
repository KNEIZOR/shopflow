import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import type { AdminOrderDetails } from '@/features/admin/orders';

import styles from '../AdminOrderPage.module.scss';

interface AdminOrderHeaderProps {
    order: AdminOrderDetails;
    language: string;
}

export const AdminOrderHeader = ({
    order,
    language,
}: AdminOrderHeaderProps) => {
    const { t } = useTranslation();

    const formatDate = (value: string) => {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat(language, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date);
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerTop}>
                <Link to="/admin/orders" className={styles.backLink}>
                    <span className={styles.backIcon} aria-hidden="true">
                        ←
                    </span>

                    {t('admin.orders.details.back')}
                </Link>
            </div>

            <div className={styles.headerContent}>
                <div className={styles.headerMain}>
                    <p className={styles.eyebrow}>
                        {t('admin.orders.details.title')}
                    </p>

                    <h1 className={styles.title}>#{order.id.slice(-8)}</h1>

                    <p className={styles.orderId}>{order.id}</p>
                </div>

                <div className={styles.headerMeta}>
                    <div>
                        <span className={styles.metaLabel}>
                            {t('admin.orders.details.created')}
                        </span>

                        <time
                            className={styles.metaValue}
                            dateTime={order.createdAt}
                        >
                            {formatDate(order.createdAt)}
                        </time>
                    </div>

                    <div>
                        <span className={styles.metaLabel}>
                            {t('admin.orders.details.updated')}
                        </span>

                        <time
                            className={styles.metaValue}
                            dateTime={order.updatedAt}
                        >
                            {formatDate(order.updatedAt)}
                        </time>
                    </div>
                </div>
            </div>
        </header>
    );
};
