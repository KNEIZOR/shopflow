import { useTranslation } from 'react-i18next';

import type { AdminDashboardOrderStatuses } from '../model/admin-dashboard.types';

import styles from '../AdminDashboardPage.module.scss';

type DashboardOrderStatusesProps = {
    statuses: AdminDashboardOrderStatuses;
};

const STATUS_ITEMS = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
] as const;

export const DashboardOrderStatuses = ({
    statuses,
}: DashboardOrderStatusesProps) => {
    const { t } = useTranslation();

    const total = Object.values(statuses).reduce(
        (sum, value) => sum + value,
        0,
    );

    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <div>
                    <span className={styles.cardEyebrow}>
                        {t('admin.dashboard.orderStatusesEyebrow')}
                    </span>

                    <h3 className={styles.cardTitle}>
                        {t('admin.dashboard.orderStatusesTitle')}
                    </h3>
                </div>

                <strong className={styles.cardTotal}>{total}</strong>
            </div>

            <div className={styles.statuses}>
                {STATUS_ITEMS.map((status) => {
                    const value = statuses[status];

                    const percentage =
                        total > 0 ? Math.round((value / total) * 100) : 0;

                    return (
                        <div key={status} className={styles.statusRow}>
                            <div className={styles.statusInfo}>
                                <span>
                                    {t(
                                        `admin.dashboard.orderStatuses.${status}`,
                                    )}
                                </span>

                                <strong>{value}</strong>
                            </div>

                            <div className={styles.statusTrack}>
                                <div
                                    className={`${styles.statusBar} ${styles[`statusBar${status}`] ?? ''}`}
                                    style={{
                                        width: `${percentage}%`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
