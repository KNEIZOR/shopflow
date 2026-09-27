import { useTranslation } from 'react-i18next';

import type { AdminOrderDetails } from '@/features/admin/orders';

import styles from '../AdminOrderPage.module.scss';

interface AdminOrderInformationCardProps {
    order: AdminOrderDetails;
}

const EMPTY_VALUE = '—';

const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <div className={styles.detailRow}>
        <dt>{label}</dt>
        <dd title={value}>{value}</dd>
    </div>
);

export const AdminOrderInformationCard = ({
    order,
}: AdminOrderInformationCardProps) => {
    const { t } = useTranslation();

    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                    {t('admin.orders.details.orderInformation')}
                </h2>
            </div>

            <dl className={styles.detailsList}>
                <DetailRow
                    label={t('admin.orders.details.orderId')}
                    value={order.id}
                />

                <DetailRow
                    label={t('admin.orders.details.paymentProvider')}
                    value={order.paymentProvider ?? EMPTY_VALUE}
                />

                <DetailRow
                    label={t('admin.orders.details.paymentSession')}
                    value={order.paymentSessionId ?? EMPTY_VALUE}
                />

                <DetailRow
                    label={t('admin.orders.details.paymentIntent')}
                    value={order.paymentIntentId ?? EMPTY_VALUE}
                />
            </dl>
        </section>
    );
};
