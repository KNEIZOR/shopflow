import { ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import styles from './CartEmpty.module.scss';

export const CartEmpty = () => {
    const { t } = useTranslation();

    return (
        <section className={styles.empty}>
            <div className={styles.icon}>
                <ShoppingCart size={32} strokeWidth={1.5} />
            </div>

            <span className={styles.eyebrow}>{t('cart.emptyLabel')}</span>

            <h1 className={styles.title}>{t('cart.emptyTitle')}</h1>

            <p className={styles.description}>{t('cart.emptyDescription')}</p>

            <Link to="/catalog" className={styles.link}>
                {t('cart.goToCatalog')}
            </Link>
        </section>
    );
};
