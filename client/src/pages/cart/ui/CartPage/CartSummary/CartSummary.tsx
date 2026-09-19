import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import type { CartSummary as CartSummaryType } from '@/entities/cart';
import { useClearCart } from '@/features/cart-item-actions';
import { formatCurrency } from '@/shared/lib/formatCurrency';

import styles from './CartSummary.module.scss';

type CartSummaryProps = {
    summary: CartSummaryType;
    disabled?: boolean;
};

export const CartSummary = ({
    summary,
    disabled = false,
}: CartSummaryProps) => {
    const { t } = useTranslation();

    const clearMutation = useClearCart();

    const handleClear = () => {
        if (disabled || clearMutation.isPending) {
            return;
        }

        clearMutation.mutate();
    };

    const isCheckoutDisabled = disabled || summary.itemsCount === 0;

    return (
        <aside className={styles.summary}>
            <div className={styles.header}>
                <span className={styles.eyebrow}>{t('cart.summaryLabel')}</span>

                <h2 className={styles.title}>{t('cart.orderSummary')}</h2>
            </div>

            <div className={styles.rows}>
                <div className={styles.row}>
                    <span>{t('cart.items')}</span>

                    <strong>{summary.itemsCount}</strong>
                </div>

                <div className={`${styles.row} ${styles.total}`}>
                    <span>{t('cart.total')}</span>

                    <strong>
                        {formatCurrency(summary.subtotal, summary.currency)}
                    </strong>
                </div>
            </div>

            {isCheckoutDisabled ? (
                <button
                    type="button"
                    className={`${styles.checkout} ${styles.checkoutDisabled}`}
                    disabled
                >
                    {t('cart.checkout')}
                </button>
            ) : (
                <Link to="/checkout" className={styles.checkout}>
                    {t('cart.checkout')}
                </Link>
            )}

            <button
                type="button"
                className={styles.clear}
                onClick={handleClear}
                disabled={
                    disabled ||
                    clearMutation.isPending ||
                    summary.itemsCount === 0
                }
            >
                {clearMutation.isPending ? t('cart.clearing') : t('cart.clear')}
            </button>
        </aside>
    );
};
