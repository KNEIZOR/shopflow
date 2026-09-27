import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type {
    AdminOrderStatus,
    AdminPaymentStatus,
} from '@/features/admin/orders';

import styles from '../AdminOrderPage.module.scss';

interface AdminOrderStatusCardProps {
    status: AdminOrderStatus;
    paymentStatus: AdminPaymentStatus;
    onStatusChange: (status: AdminOrderStatus) => Promise<void>;
    isUpdating: boolean;
    updateError: boolean;
}

const STATUS_TRANSITIONS: Record<
    AdminOrderStatus,
    readonly AdminOrderStatus[]
> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
};

const getStatusClassName = (
    status: AdminOrderStatus,
    stylesMap: Record<string, string>,
) => stylesMap[`status${status}`] ?? stylesMap.statusDefault;

const getPaymentClassName = (
    status: AdminPaymentStatus,
    stylesMap: Record<string, string>,
) => stylesMap[`payment${status}`] ?? stylesMap.paymentDefault;

const getAvailableStatuses = (
    status: AdminOrderStatus,
): readonly AdminOrderStatus[] => {
    return [status, ...STATUS_TRANSITIONS[status]].filter(
        (value, index, values) => values.indexOf(value) === index,
    );
};

export const AdminOrderStatusCard = ({
    status,
    paymentStatus,
    onStatusChange,
    isUpdating,
    updateError,
}: AdminOrderStatusCardProps) => {
    const { t } = useTranslation();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedStatus, setSelectedStatus] =
        useState<AdminOrderStatus>(status);

    const statusOptions = getAvailableStatuses(status);
    const hasAvailableTransitions = STATUS_TRANSITIONS[status].length > 0;
    const hasChanged = selectedStatus !== status;

    const statusLabel = t(`admin.orders.status.${status}`);
    const paymentLabel = t(`admin.orders.paymentStatus.${paymentStatus}`);

    const handleStartEditing = () => {
        setSelectedStatus(status);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setSelectedStatus(status);
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!hasChanged) {
            setIsEditing(false);
            return;
        }

        await onStatusChange(selectedStatus);
        setIsEditing(false);
    };

    return (
        <section className={styles.statusCard}>
            <div className={styles.statusSection}>
                <div className={styles.cardHeading}>
                    <span className={styles.cardLabel}>
                        {t('admin.orders.table.status')}
                    </span>

                    <span
                        className={`${styles.statusBadge} ${getStatusClassName(
                            status,
                            styles,
                        )}`}
                    >
                        {statusLabel}
                    </span>
                </div>

                {!isEditing ? (
                    hasAvailableTransitions ? (
                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={handleStartEditing}
                        >
                            {t('admin.orders.actions.changeStatus')}
                        </button>
                    ) : null
                ) : (
                    <div className={styles.statusEditor}>
                        <select
                            value={selectedStatus}
                            onChange={(event) =>
                                setSelectedStatus(
                                    event.target.value as AdminOrderStatus,
                                )
                            }
                            className={styles.statusSelect}
                            disabled={isUpdating}
                        >
                            {statusOptions.map((option) => (
                                <option key={option} value={option}>
                                    {t(`admin.orders.status.${option}`)}
                                </option>
                            ))}
                        </select>

                        <div className={styles.statusEditorActions}>
                            <button
                                type="button"
                                className={styles.primaryButton}
                                onClick={() => void handleSave()}
                                disabled={isUpdating || !hasChanged}
                            >
                                {isUpdating
                                    ? t('admin.orders.actions.updating')
                                    : t('admin.orders.actions.save')}
                            </button>

                            <button
                                type="button"
                                className={styles.secondaryButton}
                                onClick={handleCancel}
                                disabled={isUpdating}
                            >
                                {t('admin.orders.actions.cancel')}
                            </button>
                        </div>

                        {updateError && (
                            <p className={styles.updateError}>
                                {t('admin.orders.messages.statusUpdateError')}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.statusDivider} />

            <div className={styles.paymentSection}>
                <div className={styles.cardHeading}>
                    <span className={styles.cardLabel}>
                        {t('admin.orders.table.payment')}
                    </span>

                    <span
                        className={`${styles.paymentBadge} ${getPaymentClassName(
                            paymentStatus,
                            styles,
                        )}`}
                    >
                        {paymentLabel}
                    </span>
                </div>
            </div>
        </section>
    );
};
