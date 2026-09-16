import { useTranslation } from 'react-i18next';

import styles from './AdminDashboardPage.module.scss';

const DASHBOARD_STATS = [
    {
        id: 'products',
        value: '—',
    },
    {
        id: 'orders',
        value: '—',
    },
    {
        id: 'users',
        value: '—',
    },
    {
        id: 'revenue',
        value: '—',
    },
] as const;

export const AdminDashboardPage = () => {
    const { t } = useTranslation();

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>
                        {t('admin.dashboard.eyebrow')}
                    </p>

                    <h2 className={styles.title}>
                        {t('admin.dashboard.title')}
                    </h2>

                    <p className={styles.description}>
                        {t('admin.dashboard.description')}
                    </p>
                </div>
            </header>

            <div className={styles.stats}>
                {DASHBOARD_STATS.map((stat) => (
                    <article key={stat.id} className={styles.stat}>
                        <span className={styles.statLabel}>
                            {t(`admin.dashboard.stats.${stat.id}`)}
                        </span>

                        <strong className={styles.statValue}>
                            {stat.value}
                        </strong>
                    </article>
                ))}
            </div>

            <div className={styles.grid}>
                <section className={styles.card}>
                    <h3 className={styles.cardTitle}>
                        {t('admin.dashboard.recentOrders')}
                    </h3>

                    <div className={styles.empty}>
                        {t('admin.dashboard.noRecentOrders')}
                    </div>
                </section>

                <section className={styles.card}>
                    <h3 className={styles.cardTitle}>
                        {t('admin.dashboard.quickActions')}
                    </h3>

                    <div className={styles.actions}>
                        <div className={styles.action}>
                            <span>{t('admin.dashboard.actions.products')}</span>

                            <span>→</span>
                        </div>

                        <div className={styles.action}>
                            <span>
                                {t('admin.dashboard.actions.categories')}
                            </span>

                            <span>→</span>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
};
