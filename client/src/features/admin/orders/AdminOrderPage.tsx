import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useLocale } from '@/entities/locale';

import {
    useAdminOrder,
    useUpdateAdminOrderStatus,
    type AdminOrderStatus,
} from '@/features/admin/orders';

import { AdminOrderCustomerCard } from './components/AdminOrderCustomerCard';
import { AdminOrderHeader } from './components/AdminOrderHeader';
import { AdminOrderInformationCard } from './components/AdminOrderInformationCard';
import { AdminOrderItemsCard } from './components/AdminOrderItemsCard';
import { AdminOrderStatusCard } from './components/AdminOrderStatusCard';

import styles from './AdminOrderPage.module.scss';

export const AdminOrderPage = () => {
    const { t } = useTranslation();
    const { language } = useLocale();
    const navigate = useNavigate();

    const { orderId = '' } = useParams<{
        orderId: string;
    }>();

    const orderQuery = useAdminOrder(orderId);
    const updateStatusMutation = useUpdateAdminOrderStatus();

    const order = orderQuery.data;

    const handleStatusChange = useCallback(
        async (status: AdminOrderStatus) => {
            if (!orderId) {
                return;
            }

            await updateStatusMutation.mutateAsync({
                orderId,
                status,
            });
        },
        [orderId, updateStatusMutation],
    );

    if (orderQuery.isLoading) {
        return (
            <section className={styles.page}>
                <div className={styles.state}>
                    <div className={styles.spinner} />

                    <span>{t('common.loading')}</span>
                </div>
            </section>
        );
    }

    if (orderQuery.isError || !order) {
        return (
            <section className={styles.page}>
                <div className={styles.state}>
                    <div className={styles.errorIcon} aria-hidden="true">
                        !
                    </div>

                    <h1 className={styles.stateTitle}>
                        {t('admin.orders.error.title')}
                    </h1>

                    <p className={styles.stateDescription}>
                        {t('admin.orders.error.description')}
                    </p>

                    <div className={styles.stateActions}>
                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={() => void orderQuery.refetch()}
                        >
                            {t('admin.orders.error.retry')}
                        </button>

                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => navigate('/admin/orders')}
                        >
                            {t('admin.orders.details.back')}
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.page}>
            <AdminOrderHeader order={order} language={language} />

            <div className={styles.orderContent}>
                <main className={styles.mainColumn}>
                    <AdminOrderItemsCard
                        items={order.items}
                        total={order.total}
                        currency={order.currency}
                    />
                </main>

                <aside className={styles.sidebar}>
                    <AdminOrderStatusCard
                        status={order.status}
                        paymentStatus={order.paymentStatus}
                        onStatusChange={handleStatusChange}
                        isUpdating={updateStatusMutation.isPending}
                        updateError={updateStatusMutation.isError}
                    />

                    <AdminOrderCustomerCard
                        customer={order.customer}
                        address={order.address}
                    />

                    <AdminOrderInformationCard order={order} />
                </aside>
            </div>
        </section>
    );
};
