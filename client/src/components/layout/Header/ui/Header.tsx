import { ChevronDown, Globe2, ShoppingCart, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { useLocale } from '@/entities/locale';
import {
    CURRENCIES,
    LANGUAGES,
    type CurrencyCode,
    type LanguageCode,
} from '@/shared/config';
import { NAVIGATION_ITEMS } from '@/shared/config/navigation';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';

import styles from './Header.module.scss';

export const Header = () => {
    const { t } = useTranslation();

    const { language, currency, setLanguage, setCurrency } = useLocale();

    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

    const currentLanguage =
        LANGUAGES.find((item) => item.code === language) ?? LANGUAGES[0];

    const currentCurrency =
        CURRENCIES.find((item) => item.code === currency) ?? CURRENCIES[0];

    const handleLanguageToggle = () => {
        setIsLanguageOpen((isOpen) => !isOpen);
        setIsCurrencyOpen(false);
    };

    const handleCurrencyToggle = () => {
        setIsCurrencyOpen((isOpen) => !isOpen);
        setIsLanguageOpen(false);
    };

    const handleLanguageChange = (nextLanguage: LanguageCode) => {
        setLanguage(nextLanguage);
        setIsLanguageOpen(false);
        setIsCurrencyOpen(false);
    };

    const handleCurrencyChange = (nextCurrency: CurrencyCode) => {
        setCurrency(nextCurrency);
        setIsCurrencyOpen(false);
        setIsLanguageOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.header__inner}`}>
                <NavLink
                    to="/"
                    className={styles.header__logo}
                    aria-label="ShopFlow"
                >
                    <span className={styles.header__logoMark}>S</span>

                    <span className={styles.header__logoText}>ShopFlow</span>
                </NavLink>

                <nav
                    className={styles.header__nav}
                    aria-label={t('header.navigation')}
                >
                    {NAVIGATION_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `${styles.header__link} ${
                                    isActive ? styles.header__linkActive : ''
                                }`
                            }
                        >
                            <span>{t(item.labelKey)}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.header__actions}>
                    <div className={styles.header__localeControl}>
                        <div className={styles.language}>
                            <button
                                type="button"
                                className={`${styles.language__trigger} ${
                                    isLanguageOpen
                                        ? styles.language__triggerOpen
                                        : ''
                                }`}
                                onClick={handleLanguageToggle}
                                aria-label={t('header.language')}
                                aria-expanded={isLanguageOpen}
                                aria-haspopup="listbox"
                            >
                                <Globe2 size={17} strokeWidth={1.8} />

                                <span>{currentLanguage.flag}</span>

                                <span>
                                    {currentLanguage.code.toUpperCase()}
                                </span>

                                <ChevronDown
                                    size={14}
                                    strokeWidth={1.8}
                                    className={
                                        isLanguageOpen
                                            ? styles.language__arrowOpen
                                            : styles.language__arrow
                                    }
                                />
                            </button>

                            <div
                                className={`${styles.language__dropdown} ${
                                    isLanguageOpen
                                        ? styles.language__dropdownOpen
                                        : ''
                                }`}
                                role="listbox"
                                aria-label={t('header.language')}
                                aria-hidden={!isLanguageOpen}
                            >
                                {LANGUAGES.map((item) => (
                                    <button
                                        key={item.code}
                                        type="button"
                                        role="option"
                                        aria-selected={
                                            item.code === currentLanguage.code
                                        }
                                        tabIndex={isLanguageOpen ? 0 : -1}
                                        className={`${styles.language__option} ${
                                            item.code === currentLanguage.code
                                                ? styles.language__optionActive
                                                : ''
                                        }`}
                                        onClick={() =>
                                            handleLanguageChange(item.code)
                                        }
                                    >
                                        <span>{item.flag}</span>

                                        <span>{t(item.labelKey)}</span>

                                        {item.code === currentLanguage.code && (
                                            <span
                                                className={
                                                    styles.language__check
                                                }
                                                aria-hidden="true"
                                            >
                                                ✓
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.currency}>
                            <button
                                type="button"
                                className={`${styles.currency__trigger} ${
                                    isCurrencyOpen
                                        ? styles.currency__triggerOpen
                                        : ''
                                }`}
                                onClick={handleCurrencyToggle}
                                aria-label={t('header.currency')}
                                aria-expanded={isCurrencyOpen}
                                aria-haspopup="listbox"
                            >
                                <span>{currentCurrency.symbol}</span>

                                <span>{currentCurrency.code}</span>

                                <ChevronDown
                                    size={14}
                                    strokeWidth={1.8}
                                    className={
                                        isCurrencyOpen
                                            ? styles.currency__arrowOpen
                                            : styles.currency__arrow
                                    }
                                />
                            </button>

                            <div
                                className={`${styles.currency__dropdown} ${
                                    isCurrencyOpen
                                        ? styles.currency__dropdownOpen
                                        : ''
                                }`}
                                role="listbox"
                                aria-label={t('header.currency')}
                                aria-hidden={!isCurrencyOpen}
                            >
                                {CURRENCIES.map((item) => (
                                    <button
                                        key={item.code}
                                        type="button"
                                        role="option"
                                        aria-selected={
                                            item.code === currentCurrency.code
                                        }
                                        tabIndex={isCurrencyOpen ? 0 : -1}
                                        className={`${styles.currency__option} ${
                                            item.code === currentCurrency.code
                                                ? styles.currency__optionActive
                                                : ''
                                        }`}
                                        onClick={() =>
                                            handleCurrencyChange(item.code)
                                        }
                                    >
                                        <span
                                            className={styles.currency__symbol}
                                        >
                                            {item.symbol}
                                        </span>

                                        <span>{item.code}</span>

                                        {item.code === currentCurrency.code && (
                                            <span
                                                className={
                                                    styles.currency__check
                                                }
                                                aria-hidden="true"
                                            >
                                                ✓
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <ThemeToggle />

                    <NavLink
                        to="/account"
                        className={({ isActive }) =>
                            `${styles.header__iconLink} ${
                                isActive ? styles.header__iconLinkActive : ''
                            }`
                        }
                        aria-label={t('header.account')}
                        title={t('header.account')}
                    >
                        <UserRound size={20} strokeWidth={1.8} />
                    </NavLink>

                    <NavLink
                        to="/cart"
                        className={({ isActive }) =>
                            `${styles.header__iconLink} ${
                                isActive ? styles.header__iconLinkActive : ''
                            }`
                        }
                        aria-label={t('header.cart')}
                        title={t('header.cart')}
                    >
                        <ShoppingCart size={20} strokeWidth={1.8} />

                        <span
                            className={styles.header__cartCount}
                            aria-label={t('header.cartItems', {
                                count: 0,
                            })}
                        >
                            0
                        </span>
                    </NavLink>
                </div>
            </div>
        </header>
    );
};
