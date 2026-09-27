import { useTranslation } from 'react-i18next';

import type { AdminDashboardRecentOrder } from '../model/admin-dashboard.types';

import styles from '../AdminDashboardPage.module.scss';

type DashboardRecentOrdersProps = {
    orders: AdminDashboardRecentOrder[];
};

const formatDate = (value: string, language: string) => {
    return new Intl.DateTimeFormat(language, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
};

export const DashboardRecentOrders = ({
    orders,
}: DashboardRecentOrdersProps) => {
    const { t, i18n } = useTranslation();

    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <div>
                    <span className={styles.cardEyebrow}>
                        {t('admin.dashboard.recentOrdersEyebrow')}
                    </span>

                    <h3 className={styles.cardTitle}>
                        {t('admin.dashboard.recentOrders')}
                    </h3>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className={styles.empty}>
                    {t('admin.dashboard.noRecentOrders')}
                </div>
            ) : (
                <div className={styles.orders}>
                    {orders.map((order) => (
                        <article key={order.id} className={styles.order}>
                            <div className={styles.orderMain}>
                                <div className={styles.orderIdentity}>
                                    <strong className={styles.orderCustomer}>
                                        {order.customer.name}
                                    </strong>

                                    <span className={styles.orderEmail}>
                                        {order.customer.email}
                                    </span>
                                </div>

                                <span className={styles.orderDate}>
                                    {formatDate(order.createdAt, i18n.language)}
                                </span>
                            </div>

                            <div className={styles.orderMeta}>
                                <span
                                    className={`${styles.badge} ${styles[`status${order.status}`] ?? ''}`}
                                >
                                    {t(
                                        `admin.dashboard.orderStatuses.${order.status}`,
                                        {
                                            defaultValue: order.status,
                                        },
                                    )}
                                </span>

                                <span
                                    className={`${styles.badge} ${styles[`payment${order.paymentStatus}`] ?? ''}`}
                                >
                                    {t(
                                        `admin.dashboard.paymentStatuses.${order.paymentStatus}`,
                                        {
                                            defaultValue: order.paymentStatus,
                                        },
                                    )}
                                </span>

                                <span className={styles.orderItems}>
                                    {t('admin.dashboard.itemsCount', {
                                        count: order.itemsCount,
                                    })}
                                </span>

                                <strong className={styles.orderTotal}>
                                    {order.total} {order.currency}
                                </strong>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};
