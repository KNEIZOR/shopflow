import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import styles from './CheckoutSuccessPage.module.scss';

export const CheckoutSuccessPage = () => {
    const { t } = useTranslation();

    return (
        <main className={styles.page}>
            <div className="container">
                <section className={styles.card}>
                    <div className={styles.icon}>
                        <CheckCircle2 size={34} strokeWidth={1.8} />
                    </div>

                    <span className={styles.eyebrow}>
                        {t('checkout.successLabel')}
                    </span>

                    <h1>{t('checkout.successTitle')}</h1>

                    <p>{t('checkout.successDescription')}</p>

                    <div className={styles.actions}>
                        <Link to="/account" className={styles.primary}>
                            {t('checkout.goToAccount')}
                        </Link>

                        <Link to="/catalog" className={styles.secondary}>
                            {t('checkout.continueShopping')}
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
};
