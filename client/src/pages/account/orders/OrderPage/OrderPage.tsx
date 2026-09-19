import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import {
    useOrder,
    type OrderStatus,
    type PaymentStatus,
} from '@/entities/order';
import { formatCurrency } from '@/shared/lib/formatCurrency';

import styles from './OrderPage.module.scss';

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
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

export const OrderPage = () => {
    const { t, i18n } = useTranslation();
    const { orderId = '' } = useParams<{ orderId: string }>();

    const orderQuery = useOrder(orderId);

    if (orderQuery.isLoading) {
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

    if (orderQuery.isError || !orderQuery.data) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.state}>
                        <span className={styles.stateEyebrow}>
                            {t('orders.eyebrow')}
                        </span>

                        <h1>{t('orders.notFoundTitle')}</h1>

                        <p>{t('orders.notFoundDescription')}</p>

                        <Link
                            to="/account/orders"
                            className={styles.primaryButton}
                        >
                            {t('orders.backToOrders')}
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const order = orderQuery.data;

    return (
        <main className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div>
                        <p className={styles.eyebrow}>
                            {t('orders.orderDetails')}
                        </p>

                        <h1 className={styles.title}>#{order.id}</h1>

                        <p className={styles.date}>
                            {t('orders.createdAt')}:{' '}
                            {formatOrderDate(order.createdAt, i18n.language)}
                        </p>
                    </div>

                    <Link
                        to="/account/orders"
                        className={styles.secondaryButton}
                    >
                        {t('orders.backToOrders')}
                    </Link>
                </header>

                <div className={styles.statusGrid}>
                    <section className={styles.statusCard}>
                        <span className={styles.cardEyebrow}>
                            {t('orders.status')}
                        </span>

                        <span
                            className={`${styles.statusBadge} ${getOrderStatusClassName(
                                order.status,
                            )}`}
                        >
                            {t(getOrderStatusKey(order.status))}
                        </span>
                    </section>

                    <section className={styles.statusCard}>
                        <span className={styles.cardEyebrow}>
                            {t('orders.payment')}
                        </span>

                        <span
                            className={`${styles.statusBadge} ${getPaymentStatusClassName(
                                order.paymentStatus,
                            )}`}
                        >
                            {t(getPaymentStatusKey(order.paymentStatus))}
                        </span>
                    </section>

                    <section className={styles.statusCard}>
                        <span className={styles.cardEyebrow}>
                            {t('orders.paymentProvider')}
                        </span>

                        <strong className={styles.provider}>
                            {order.paymentProvider === 'stripe'
                                ? t('orders.providerStripe')
                                : order.paymentProvider ||
                                  t('orders.providerUnknown')}
                        </strong>
                    </section>

                    <section className={styles.statusCard}>
                        <span className={styles.cardEyebrow}>
                            {t('orders.total')}
                        </span>

                        <strong className={styles.total}>
                            {formatCurrency(order.total, order.currency)}
                        </strong>
                    </section>
                </div>

                <div className={styles.layout}>
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <p className={styles.cardEyebrow}>
                                    {t('orders.orderItems')}
                                </p>

                                <h2 className={styles.cardTitle}>
                                    {t('orders.items')}
                                </h2>
                            </div>
                        </div>

                        <div className={styles.items}>
                            {order.items.map((item) => {
                                const image = item.product.images[0];

                                return (
                                    <article
                                        key={item.id}
                                        className={styles.item}
                                    >
                                        <div className={styles.itemImage}>
                                            {image?.url ? (
                                                <img
                                                    src={image.url}
                                                    alt={
                                                        image.alt ??
                                                        item.product.name
                                                    }
                                                />
                                            ) : (
                                                <span>
                                                    {t('orders.product')}
                                                </span>
                                            )}
                                        </div>

                                        <div className={styles.itemInfo}>
                                            <h3>{item.product.name}</h3>

                                            <p>
                                                {t('orders.variant')}:{' '}
                                                {item.variant.name}
                                            </p>

                                            <p>
                                                {t('orders.sku')}:{' '}
                                                {item.variant.sku}
                                            </p>

                                            <p>
                                                {t('orders.quantity')}:{' '}
                                                {item.quantity}
                                            </p>
                                        </div>

                                        <div className={styles.itemPricing}>
                                            <span>
                                                {formatCurrency(
                                                    item.price,
                                                    order.currency,
                                                )}
                                            </span>

                                            <strong>
                                                {formatCurrency(
                                                    item.subtotal,
                                                    order.currency,
                                                )}
                                            </strong>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        <div className={styles.totalRow}>
                            <span>{t('orders.total')}</span>

                            <strong>
                                {formatCurrency(order.total, order.currency)}
                            </strong>
                        </div>
                    </section>

                    <aside className={styles.sidebar}>
                        <section className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <p className={styles.cardEyebrow}>
                                        {t('orders.delivery')}
                                    </p>

                                    <h2 className={styles.cardTitle}>
                                        {t('orders.address')}
                                    </h2>
                                </div>
                            </div>

                            <address className={styles.address}>
                                <strong>
                                    {order.address.firstName}{' '}
                                    {order.address.lastName}
                                </strong>

                                <span>
                                    {order.address.street}
                                    {order.address.apartment
                                        ? `, ${order.address.apartment}`
                                        : ''}
                                </span>

                                <span>
                                    {order.address.postalCode},{' '}
                                    {order.address.city}
                                </span>

                                <span>{order.address.country}</span>

                                <span>
                                    {t('orders.phone')}: {order.address.phone}
                                </span>
                            </address>
                        </section>
                    </aside>
                </div>
            </div>
        </main>
    );
};
