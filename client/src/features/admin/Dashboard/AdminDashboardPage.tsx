import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useAdminDashboard } from './model/use-admin-dashboard';

import { DashboardOrderStatuses } from './ui/DashboardOrderStatuses';
import { DashboardRecentOrders } from './ui/DashboardRecentOrders';
import { DashboardStats } from './ui/DashboardStats';

import styles from './AdminDashboardPage.module.scss';

export const AdminDashboardPage = () => {
    const { t } = useTranslation();

    const { data, isLoading, isError, refetch } = useAdminDashboard();

    if (isLoading) {
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
                    </div>
                </header>

                <div className={styles.loading}>
                    <div className={styles.loadingStats}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className={styles.skeletonStat} />
                        ))}
                    </div>

                    <div className={styles.loadingGrid}>
                        <div className={styles.skeletonCard} />
                        <div className={styles.skeletonCard} />
                    </div>
                </div>
            </section>
        );
    }

    if (isError || !data) {
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

                <div className={styles.error}>
                    <strong>{t('admin.dashboard.errorTitle')}</strong>

                    <p>{t('admin.dashboard.errorDescription')}</p>

                    <button
                        type="button"
                        className={styles.retryButton}
                        onClick={() => void refetch()}
                    >
                        {t('admin.dashboard.retry')}
                    </button>
                </div>
            </section>
        );
    }

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

                <button
                    type="button"
                    className={styles.refreshButton}
                    onClick={() => void refetch()}
                >
                    {t('admin.dashboard.refresh')}
                </button>
            </header>

            <DashboardStats stats={data.stats} />

            <div className={styles.grid}>
                <DashboardRecentOrders orders={data.recentOrders} />

                <DashboardOrderStatuses statuses={data.orderStatuses} />

                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <span className={styles.cardEyebrow}>
                                {t('admin.dashboard.quickActionsEyebrow')}
                            </span>

                            <h3 className={styles.cardTitle}>
                                {t('admin.dashboard.quickActions')}
                            </h3>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Link to="/admin/products" className={styles.action}>
                            <span>{t('admin.dashboard.actions.products')}</span>

                            <span className={styles.actionArrow}>→</span>
                        </Link>

                        <Link to="/admin/categories" className={styles.action}>
                            <span>
                                {t('admin.dashboard.actions.categories')}
                            </span>

                            <span className={styles.actionArrow}>→</span>
                        </Link>

                        <Link
                            to="/admin/product-types"
                            className={styles.action}
                        >
                            <span>
                                {t('admin.dashboard.actions.productTypes')}
                            </span>

                            <span className={styles.actionArrow}>→</span>
                        </Link>
                    </div>
                </section>
            </div>
        </section>
    );
};
