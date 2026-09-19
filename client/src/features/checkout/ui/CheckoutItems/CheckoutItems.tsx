import { useTranslation } from 'react-i18next';

import type { CartItem } from '@/entities/cart';
import type { CurrencyCode } from '@/shared/config/currencies';
import { formatCurrency } from '@/shared/lib/formatCurrency';

import styles from './CheckoutItems.module.scss';

type CheckoutItemsProps = {
    items: CartItem[];
    currency: CurrencyCode;
};

export const CheckoutItems = ({ items, currency }: CheckoutItemsProps) => {
    const { t } = useTranslation();

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <span className={styles.eyebrow}>
                    {t('checkout.orderLabel')}
                </span>

                <h2 className={styles.title}>{t('checkout.yourOrder')}</h2>
            </div>

            <div className={styles.list}>
                {items.map((item) => (
                    <article key={item.id} className={styles.item}>
                        <div className={styles.info}>
                            <strong>{item.product.name}</strong>

                            <span>{item.variant.name}</span>

                            <span>
                                {t('checkout.quantity')}: {item.quantity}
                            </span>
                        </div>

                        <strong className={styles.price}>
                            {formatCurrency(item.subtotal, currency)}
                        </strong>
                    </article>
                ))}
            </div>
        </section>
    );
};
