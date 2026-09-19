import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/entities/auth';
import { useCart } from '@/entities/cart';

import styles from './AccountPage.module.scss';

export const AccountPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { user, logout } = useAuth();
    const { data: cart } = useCart();

    if (!user) {
        return null;
    }

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

    const displayName = fullName || user.email;

    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
            await navigate('/account/login', { replace: true });
        } catch {
            // The auth state is managed by AuthProvider.
            // Keep the page stable if the logout request fails.
        }
    };

    return (
        <main className={styles.page}>
            <div className="container">
                <div className={styles.header}>
                    <div>
                        <p className={styles.eyebrow}>
                            {t('auth.account.eyebrow')}
                        </p>

                        <h1 className={styles.title}>
                            {t('auth.account.title')}
                        </h1>

                        <p className={styles.description}>
                            {t('auth.account.greeting', {
                                name: displayName,
                            })}
                        </p>
                    </div>

                    <button
                        type="button"
                        className={styles.logoutButton}
                        onClick={() => void handleLogout()}
                    >
                        {t('auth.account.logout')}
                    </button>
                </div>

                <div className={styles.grid}>
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <p className={styles.cardEyebrow}>
                                    {t('auth.account.profile.eyebrow')}
                                </p>

                                <h2 className={styles.cardTitle}>
                                    {t('auth.account.profile.title')}
                                </h2>
                            </div>
                        </div>

                        <div className={styles.profile}>
                            <div className={styles.profileRow}>
                                <span className={styles.label}>
                                    {t('auth.account.profile.firstName')}
                                </span>

                                <span className={styles.value}>
                                    {user.firstName ||
                                        t('auth.account.profile.notSpecified')}
                                </span>
                            </div>

                            <div className={styles.profileRow}>
                                <span className={styles.label}>
                                    {t('auth.account.profile.lastName')}
                                </span>

                                <span className={styles.value}>
                                    {user.lastName ||
                                        t('auth.account.profile.notSpecified')}
                                </span>
                            </div>

                            <div className={styles.profileRow}>
                                <span className={styles.label}>
                                    {t('auth.account.profile.email')}
                                </span>

                                <span className={styles.value}>
                                    {user.email}
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <p className={styles.cardEyebrow}>
                                    {t('auth.account.cart.eyebrow')}
                                </p>

                                <h2 className={styles.cardTitle}>
                                    {t('auth.account.cart.title')}
                                </h2>
                            </div>

                            <span className={styles.cartCount}>
                                {cart?.summary.itemsCount ?? 0}
                            </span>
                        </div>

                        <p className={styles.cardDescription}>
                            {t('auth.account.cart.description')}
                        </p>

                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={() => void navigate('/cart')}
                        >
                            {t('auth.account.cart.open')}
                        </button>
                    </section>

                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <p className={styles.cardEyebrow}>
                                    {t('auth.account.orders.eyebrow')}
                                </p>

                                <h2 className={styles.cardTitle}>
                                    {t('auth.account.orders.title')}
                                </h2>
                            </div>
                        </div>

                        <p className={styles.cardDescription}>
                            {t('auth.account.orders.description')}
                        </p>

                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={() => void navigate('/account/orders')}
                        >
                            {t('auth.account.orders.open')}
                        </button>
                    </section>
                </div>
            </div>
        </main>
    );
};
