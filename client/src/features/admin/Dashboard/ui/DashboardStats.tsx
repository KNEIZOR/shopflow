import { useTranslation } from 'react-i18next';

import type { AdminDashboardStats as DashboardStatsData } from '../model/admin-dashboard.types';

import styles from '../AdminDashboardPage.module.scss';

type DashboardStatsProps = {
    stats: DashboardStatsData;
};

const STAT_ITEMS = [
    {
        id: 'products',
        valueKey: 'products',
    },
    {
        id: 'orders',
        valueKey: 'orders',
    },
    {
        id: 'users',
        valueKey: 'users',
    },
    {
        id: 'revenue',
        valueKey: 'revenue',
    },
] as const;

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
    const { t } = useTranslation();

    const values = {
        products: String(stats.products),
        orders: String(stats.orders),
        users: String(stats.users),
        revenue: `${stats.revenue} ${stats.revenueCurrency}`,
    };

    return (
        <div className={styles.stats}>
            {STAT_ITEMS.map((item) => (
                <article key={item.id} className={styles.stat}>
                    <span className={styles.statLabel}>
                        {t(`admin.dashboard.stats.${item.id}`)}
                    </span>

                    <strong className={styles.statValue}>
                        {values[item.valueKey]}
                    </strong>
                </article>
            ))}
        </div>
    );
};
