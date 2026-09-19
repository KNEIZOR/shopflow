import { CircleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import styles from './CheckoutCancelPage.module.scss';

export const CheckoutCancelPage = () => {
    const { t } = useTranslation();

    return (
        <main className={styles.page}>
            <div className="container">
                <section className={styles.card}>
                    <div className={styles.icon}>
                        <CircleAlert size={34} strokeWidth={1.8} />
                    </div>

                    <span className={styles.eyebrow}>
                        {t('checkout.cancelLabel')}
                    </span>

                    <h1>{t('checkout.cancelTitle')}</h1>

                    <p>{t('checkout.cancelDescription')}</p>

                    <div className={styles.actions}>
                        <Link to="/checkout" className={styles.primary}>
                            {t('checkout.returnToCheckout')}
                        </Link>

                        <Link to="/cart" className={styles.secondary}>
                            {t('checkout.backToCart')}
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
};
