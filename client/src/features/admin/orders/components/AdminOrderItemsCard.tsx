import { useTranslation } from 'react-i18next';

import type { AdminOrderItem } from '@/features/admin/orders';

import styles from '../AdminOrderPage.module.scss';

interface AdminOrderItemsCardProps {
    items: AdminOrderItem[];
    total: string;
    currency: string;
}

export const AdminOrderItemsCard = ({
    items,
    total,
    currency,
}: AdminOrderItemsCardProps) => {
    const { t } = useTranslation();

    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                    {t('admin.orders.details.items')}
                </h2>

                <span className={styles.itemCount}>{items.length}</span>
            </div>

            <div className={styles.itemsList}>
                {items.map((item) => {
                    const image = item.product.images[0];

                    return (
                        <article key={item.id} className={styles.item}>
                            <div className={styles.itemImage}>
                                {image ? (
                                    <img
                                        src={image.url}
                                        alt={image.alt ?? item.product.name}
                                    />
                                ) : (
                                    <span aria-hidden="true">—</span>
                                )}
                            </div>

                            <div className={styles.itemInfo}>
                                <strong className={styles.itemName}>
                                    {item.product.name}
                                </strong>

                                <span className={styles.itemVariant}>
                                    {item.variant.name}
                                </span>

                                <span className={styles.itemSku}>
                                    {t('admin.orders.details.sku')}:{' '}
                                    {item.variant.sku}
                                </span>
                            </div>

                            <div className={styles.itemQuantity}>
                                × {item.quantity}
                            </div>

                            <div className={styles.itemSubtotal}>
                                {item.subtotal} {currency}
                            </div>
                        </article>
                    );
                })}
            </div>

            <div className={styles.totalRow}>
                <span>{t('admin.orders.details.total')}</span>

                <strong>
                    {total} {currency}
                </strong>
            </div>
        </section>
    );
};
