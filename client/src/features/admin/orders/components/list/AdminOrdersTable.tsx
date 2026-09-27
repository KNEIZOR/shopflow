import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import type { AdminOrderListItem } from '../../model/admin-orders.types';
import {
    formatAdminOrderDate,
    getAdminOrderCustomerName,
    getAdminOrderStatusClassName,
    getAdminPaymentStatusClassName,
} from '../../model/admin-orders.utils';

import styles from '../../AdminOrdersPage.module.scss';

interface AdminOrdersTableProps {
    orders: AdminOrderListItem[];
    language: string;
}

export const AdminOrdersTable = ({
    orders,
    language,
}: AdminOrdersTableProps) => {
    const { t } = useTranslation();

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>{t('admin.orders.table.order')}</th>

                        <th>{t('admin.orders.table.customer')}</th>

                        <th>{t('admin.orders.table.items')}</th>

                        <th>{t('admin.orders.table.total')}</th>

                        <th>{t('admin.orders.table.status')}</th>

                        <th>{t('admin.orders.table.payment')}</th>

                        <th>{t('admin.orders.table.created')}</th>

                        <th className={styles.actionsHeader}>
                            {t('admin.orders.table.actions')}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order) => (
                        <AdminOrdersTableRow
                            key={order.id}
                            order={order}
                            language={language}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

interface AdminOrdersTableRowProps {
    order: AdminOrderListItem;
    language: string;
}

const AdminOrdersTableRow = ({ order, language }: AdminOrdersTableRowProps) => {
    const { t } = useTranslation();

    const customerName = getAdminOrderCustomerName(
        order.customer.firstName,
        order.customer.lastName,
        order.customer.name,
    );

    return (
        <tr>
            <td>
                <div className={styles.orderCell}>
                    <strong className={styles.orderId}>
                        #{order.id.slice(-8)}
                    </strong>

                    <span className={styles.orderFullId}>{order.id}</span>
                </div>
            </td>

            <td>
                <div className={styles.customerCell}>
                    <strong>{customerName}</strong>

                    <span>{order.customer.email}</span>
                </div>
            </td>

            <td>
                <span className={styles.itemsCount}>{order.itemsCount}</span>
            </td>

            <td>
                <div className={styles.totalCell}>
                    <strong>{order.total}</strong>

                    <span>{order.currency}</span>
                </div>
            </td>

            <td>
                <span
                    className={`${styles.status} ${getAdminOrderStatusClassName(
                        order.status,
                        styles,
                    )}`}
                >
                    {t(`admin.orders.status.${order.status}`)}
                </span>
            </td>

            <td>
                <div className={styles.paymentCell}>
                    <span
                        className={`${styles.paymentStatus} ${getAdminPaymentStatusClassName(
                            order.paymentStatus,
                            styles,
                        )}`}
                    >
                        {t(`admin.orders.paymentStatus.${order.paymentStatus}`)}
                    </span>

                    {order.paymentProvider && (
                        <span className={styles.paymentProvider}>
                            {order.paymentProvider}
                        </span>
                    )}
                </div>
            </td>

            <td>
                <time className={styles.date} dateTime={order.createdAt}>
                    {formatAdminOrderDate(order.createdAt, language)}
                </time>
            </td>

            <td>
                <div className={styles.actions}>
                    <Link
                        to={`/admin/orders/${order.id}`}
                        className={styles.viewButton}
                        aria-label={t('admin.orders.table.view')}
                    >
                        {t('admin.orders.table.view')}
                    </Link>
                </div>
            </td>
        </tr>
    );
};
