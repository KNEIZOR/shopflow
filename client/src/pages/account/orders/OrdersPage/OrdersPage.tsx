import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { useOrders } from '@/entities/order';
import type { Order, OrderStatus, PaymentStatus } from '@/entities/order';
import { formatCurrency } from '@/shared/lib/formatCurrency';

import styles from './OrdersPage.module.scss';

const getOrderStatusKey = (status: OrderStatus): string => {
    const statusKeys: Record<OrderStatus, string> = {
        PENDING: 'orders.statusPending',
        CONFIRMED: 'orders.statusConfirmed',
        PROCESSING: 'orders.statusProcessing',
        SHIPPED: 'orders.statusShipped',
        DELIVERED: 'orders.statusDelivered',
        CANCELLED: 'orders.statusCancelled',
    };

    return statusKeys[status];
};

const getPaymentStatusKey = (status: PaymentStatus): string => {
    const statusKeys: Record<PaymentStatus, string> = {
        PENDING: 'orders.paymentPending',
        PAID: 'orders.paymentPaid',
        FAILED: 'orders.paymentFailed',
        REFUNDED: 'orders.paymentRefunded',
    };

    return statusKeys[status];
};

const getOrderStatusClassName = (status: OrderStatus): string => {
    const statusClasses: Record<OrderStatus, string> = {
        PENDING: styles.statusPending,
        CONFIRMED: styles.statusConfirmed,
        PROCESSING: styles.statusProcessing,
        SHIPPED: styles.statusShipped,
        DELIVERED: styles.statusDelivered,
        CANCELLED: styles.statusCancelled,
    };

    return statusClasses[status];
};

const getPaymentStatusClassName = (status: PaymentStatus): string => {
    const statusClasses: Record<PaymentStatus, string> = {
        PENDING: styles.paymentPending,
        PAID: styles.paymentPaid,
        FAILED: styles.paymentFailed,
        REFUNDED: styles.paymentRefunded,
    };

    return statusClasses[status];
};

const formatOrderDate = (value: string, language: string): string => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
};

type OrderCardProps = {
    order: Order;
    language: string;
};

const OrderCard = ({ order, language }: OrderCardProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const firstItem = order.items[0];

    return (
        <article
            className={styles.orderCard}
            onClick={() => void navigate(`/account/orders/${order.id}`)}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    void navigate(`/account/orders/${order.id}`);
                }
            }}
            role="button"
            tabIndex={0}
        >
            <div className={styles.orderTop}>
                <div className={styles.orderIdentity}>
                    <span className={styles.orderLabel}>
                        {t('orders.order')}
                    </span>

                    <strong className={styles.orderId}>#{order.id}</strong>

                    <span className={styles.orderDate}>
                        {formatOrderDate(order.createdAt, language)}
                    </span>
                </div>

                <div className={styles.orderBadges}>
                    <span
                        className={`${styles.statusBadge} ${getOrderStatusClassName(
                            order.status,
                        )}`}
                    >
                        {t(getOrderStatusKey(order.status))}
                    </span>

                    <span
                        className={`${styles.statusBadge} ${getPaymentStatusClassName(
                            order.paymentStatus,
                        )}`}
                    >
                        {t(getPaymentStatusKey(order.paymentStatus))}
                    </span>
                </div>
            </div>

            <div className={styles.orderBody}>
                <div className={styles.preview}>
                    {firstItem?.product.images[0]?.url ? (
                        <img
                            src={firstItem.product.images[0].url}
                            alt={
                                firstItem.product.images[0].alt ??
                                firstItem.product.name
                            }
                            className={styles.previewImage}
                        />
                    ) : (
                        <div className={styles.previewPlaceholder}>
                            {t('orders.product')}
                        </div>
                    )}

                    {order.items.length > 1 && (
                        <span className={styles.previewCount}>
                            +{order.items.length - 1}
                        </span>
                    )}
                </div>

                <div className={styles.productInfo}>
                    <p className={styles.productName}>
                        {firstItem?.product.name ?? t('orders.notSpecified')}
                    </p>

                    {firstItem?.variant.name && (
                        <p className={styles.productVariant}>
                            {firstItem.variant.name}
                        </p>
                    )}

                    <p className={styles.itemsCount}>
                        {order.items.reduce(
                            (total, item) => total + item.quantity,
                            0,
                        )}{' '}
                        {t('orders.items')}
                    </p>
                </div>

                <div className={styles.total}>
                    <span>{t('orders.total')}</span>

                    <strong>
                        {formatCurrency(order.total, order.currency)}
                    </strong>
                </div>

                <Link
                    to={`/account/orders/${order.id}`}
                    className={styles.detailsButton}
                    onClick={(event) => event.stopPropagation()}
                >
                    {t('orders.viewOrder')}
                </Link>
            </div>
        </article>
    );
};

export const OrdersPage = () => {
    const { t } = useTranslation();
    const { i18n } = useTranslation();

    const ordersQuery = useOrders();

    const orders = ordersQuery.data ?? [];

    if (ordersQuery.isLoading) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.state}>
                        <span className={styles.stateEyebrow}>
                            {t('orders.eyebrow')}
                        </span>

                        <h1>{t('orders.loading')}</h1>

                        <p>{t('orders.loadingDescription')}</p>
                    </div>
                </div>
            </main>
        );
    }

    if (ordersQuery.isError) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.state}>
                        <span className={styles.stateEyebrow}>
                            {t('orders.eyebrow')}
                        </span>

                        <h1>{t('orders.errorTitle')}</h1>

                        <p>{t('orders.errorDescription')}</p>

                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={() => void ordersQuery.refetch()}
                        >
                            {t('orders.retry')}
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (orders.length === 0) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <header className={styles.header}>
                        <div>
                            <p className={styles.eyebrow}>
                                {t('orders.eyebrow')}
                            </p>

                            <h1 className={styles.title}>
                                {t('orders.title')}
                            </h1>

                            <p className={styles.description}>
                                {t('orders.description')}
                            </p>
                        </div>

                        <Link to="/account" className={styles.secondaryButton}>
                            {t('orders.backToAccount')}
                        </Link>
                    </header>

                    <div className={styles.empty}>
                        <span className={styles.emptyIcon}>—</span>

                        <h2>{t('orders.emptyTitle')}</h2>

                        <p>{t('orders.emptyDescription')}</p>

                        <Link to="/catalog" className={styles.primaryButton}>
                            {t('orders.goToCatalog')}
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div>
                        <p className={styles.eyebrow}>{t('orders.eyebrow')}</p>

                        <h1 className={styles.title}>{t('orders.title')}</h1>

                        <p className={styles.description}>
                            {t('orders.description')}
                        </p>
                    </div>

                    <Link to="/account" className={styles.secondaryButton}>
                        {t('orders.backToAccount')}
                    </Link>
                </header>

                <div className={styles.listHeader}>
                    <span>
                        {t('orders.ordersCount', { count: orders.length })}
                    </span>
                </div>

                <section className={styles.list}>
                    {orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            language={i18n.language}
                        />
                    ))}
                </section>
            </div>
        </main>
    );
};
