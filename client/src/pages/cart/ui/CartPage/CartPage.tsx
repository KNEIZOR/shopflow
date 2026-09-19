import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { CartEmpty } from './CartEmpty';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';

import { useCartPage } from '../../model/useCartPage';

import styles from './CartPage.module.scss';

export const CartPage = () => {
    const { t } = useTranslation();

    const { isAuthenticated, isLoading, isError, cart, refetch } =
        useCartPage();

    if (isLoading) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.state}>
                        <p>{t('cart.loading')}</p>
                    </div>
                </div>
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <section className={styles.authState}>
                        <span className={styles.eyebrow}>
                            {t('cart.authLabel')}
                        </span>

                        <h1>{t('cart.authTitle')}</h1>

                        <p>{t('cart.authDescription')}</p>

                        <Link to="/account" className={styles.authButton}>
                            {t('cart.goToAccount')}
                        </Link>
                    </section>
                </div>
            </main>
        );
    }

    if (isError || !cart) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.errorState}>
                        <p>{t('cart.error')}</p>

                        <button type="button" onClick={() => void refetch()}>
                            {t('cart.retry')}
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (cart.items.length === 0) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <header className={styles.header}>
                        <span className={styles.eyebrow}>
                            {t('cart.eyebrow')}
                        </span>

                        <h1 className={styles.title}>{t('cart.title')}</h1>
                    </header>

                    <CartEmpty />
                </div>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div>
                        <span className={styles.eyebrow}>
                            {t('cart.eyebrow')}
                        </span>

                        <h1 className={styles.title}>{t('cart.title')}</h1>

                        <p className={styles.description}>
                            {t('cart.description')}
                        </p>
                    </div>

                    <span className={styles.itemCount}>
                        {t('cart.itemCount', {
                            count: cart.summary.itemsCount,
                        })}
                    </span>
                </header>

                <div className={styles.layout}>
                    <section className={styles.items}>
                        <div className={styles.itemsHeader}>
                            <h2>{t('cart.products')}</h2>
                        </div>

                        {cart.items.map((item) => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </section>

                    <CartSummary summary={cart.summary} />
                </div>
            </div>
        </main>
    );
};
