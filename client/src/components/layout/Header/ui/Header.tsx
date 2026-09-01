import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher';

import styles from './Header.module.scss';

export const Header = () => {
    const { t } = useTranslation();

    return (
        <header className={styles.header}>
            <div className={`container ${styles.header__inner}`}>
                <NavLink to="/" className={styles.header__logo}>
                    ShopFlow
                </NavLink>

                <nav
                    className={styles.header__nav}
                    aria-label={t('header.navigation')}
                >
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `${styles.header__link} ${
                                isActive ? styles.header__linkActive : ''
                            }`
                        }
                    >
                        {t('header.home')}
                    </NavLink>

                    <NavLink
                        to="/catalog"
                        className={({ isActive }) =>
                            `${styles.header__link} ${
                                isActive ? styles.header__linkActive : ''
                            }`
                        }
                    >
                        {t('header.catalog')}
                    </NavLink>

                    <NavLink
                        to="/cart"
                        className={({ isActive }) =>
                            `${styles.header__link} ${
                                isActive ? styles.header__linkActive : ''
                            }`
                        }
                    >
                        {t('header.cart')}
                    </NavLink>
                </nav>

                <LanguageSwitcher />
            </div>
        </header>
    );
};
