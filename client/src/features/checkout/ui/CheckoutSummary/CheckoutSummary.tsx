import { useTranslation } from 'react-i18next';

import type { CartSummary as CartSummaryType } from '@/entities/cart';
import type { CurrencyCode } from '@/shared/config/currencies';
import { formatCurrency } from '@/shared/lib/formatCurrency';

import styles from './CheckoutSummary.module.scss';

type CheckoutSummaryProps = {
    summary: CartSummaryType;
    canCheckout: boolean;
    isPending: boolean;
    onCheckout: () => void;
};

export const CheckoutSummary = ({
    summary,
    canCheckout,
    isPending,
    onCheckout,
}: CheckoutSummaryProps) => {
    const { t } = useTranslation();

    const currency = summary.currency as CurrencyCode;

    return (
        <aside className={styles.summary}>
            <div className={styles.header}>
                <span className={styles.eyebrow}>
                    {t('checkout.summaryLabel')}
                </span>

                <h2>{t('checkout.orderSummary')}</h2>
            </div>

            <div className={styles.rows}>
                <div className={styles.row}>
                    <span>{t('checkout.items')}</span>

                    <strong>{summary.itemsCount}</strong>
                </div>

                <div className={`${styles.row} ${styles.total}`}>
                    <span>{t('checkout.total')}</span>

                    <strong>
                        {formatCurrency(summary.subtotal, currency)}
                    </strong>
                </div>
            </div>

            <button
                type="button"
                className={styles.button}
                disabled={!canCheckout || isPending}
                onClick={onCheckout}
            >
                {isPending
                    ? t('checkout.redirectingToPayment')
                    : t('checkout.payNow')}
            </button>

            <p className={styles.note}>{t('checkout.paymentNote')}</p>
        </aside>
    );
};
