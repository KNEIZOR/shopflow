import { createPortal } from 'react-dom';
import { ChevronDown, Globe2, UserRound, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import {
    CURRENCIES,
    LANGUAGES,
    type CurrencyCode,
    type LanguageCode,
} from '@/shared/config';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';

import styles from './MobileMenu.module.scss';

type MobileMenuProps = {
    isOpen: boolean;
    currentLanguage: (typeof LANGUAGES)[number];
    currentCurrency: (typeof CURRENCIES)[number];
    isLanguageOpen: boolean;
    isCurrencyOpen: boolean;
    onClose: () => void;
    onLanguageToggle: () => void;
    onCurrencyToggle: () => void;
    onLanguageChange: (language: LanguageCode) => void;
    onCurrencyChange: (currency: CurrencyCode) => void;
};

export const MobileMenu = ({
    isOpen,
    currentLanguage,
    currentCurrency,
    isLanguageOpen,
    isCurrencyOpen,
    onClose,
    onLanguageToggle,
    onCurrencyToggle,
    onLanguageChange,
    onCurrencyChange,
}: MobileMenuProps) => {
    const { t } = useTranslation();

    if (!isOpen || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <div
            id="shopflow-mobile-menu"
            className={styles.menu}
            role="dialog"
            aria-modal="true"
            aria-label={t('header.navigation')}
        >
            <button
                type="button"
                className={styles.menu__backdrop}
                onClick={onClose}
                aria-label={t('header.navigation')}
            />

            <aside className={styles.menu__panel}>
                <div className={styles.menu__header}>
                    <span className={styles.menu__title}>
                        {t('header.navigation')}
                    </span>

                    <button
                        type="button"
                        className={styles.menu__close}
                        onClick={onClose}
                        aria-label={t('header.navigation')}
                    >
                        <X size={20} strokeWidth={1.8} />
                    </button>
                </div>

                <nav
                    className={styles.menu__navigation}
                    aria-label={t('header.navigation')}
                >
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `${styles.menu__link} ${
                                isActive ? styles.menu__linkActive : ''
                            }`
                        }
                        onClick={onClose}
                    >
                        {t('header.home')}
                    </NavLink>

                    <NavLink
                        to="/catalog"
                        className={({ isActive }) =>
                            `${styles.menu__link} ${
                                isActive ? styles.menu__linkActive : ''
                            }`
                        }
                        onClick={onClose}
                    >
                        {t('header.catalog')}
                    </NavLink>

                    <NavLink
                        to="/account"
                        className={({ isActive }) =>
                            `${styles.menu__link} ${
                                isActive ? styles.menu__linkActive : ''
                            }`
                        }
                        onClick={onClose}
                    >
                        <span>{t('header.account')}</span>

                        <UserRound size={18} strokeWidth={1.8} />
                    </NavLink>
                </nav>

                <div className={styles.menu__divider} />

                <div className={styles.menu__settings}>
                    <div className={styles.menu__setting}>
                        <span className={styles.menu__settingLabel}>
                            <Globe2 size={17} strokeWidth={1.8} />

                            {t('header.language')}
                        </span>

                        <div className={styles.language}>
                            <button
                                type="button"
                                className={`${styles.language__trigger} ${
                                    isLanguageOpen
                                        ? styles.language__triggerOpen
                                        : ''
                                }`}
                                onClick={onLanguageToggle}
                                aria-expanded={isLanguageOpen}
                                aria-haspopup="listbox"
                            >
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
                                        className={`${
                                            styles.language__option
                                        } ${
                                            item.code === currentLanguage.code
                                                ? styles.language__optionActive
                                                : ''
                                        }`}
                                        onClick={() =>
                                            onLanguageChange(item.code)
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
                    </div>

                    <div className={styles.menu__setting}>
                        <span className={styles.menu__settingLabel}>
                            {t('header.currency')}
                        </span>

                        <div className={styles.currency}>
                            <button
                                type="button"
                                className={`${styles.currency__trigger} ${
                                    isCurrencyOpen
                                        ? styles.currency__triggerOpen
                                        : ''
                                }`}
                                onClick={onCurrencyToggle}
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
                                        className={`${
                                            styles.currency__option
                                        } ${
                                            item.code === currentCurrency.code
                                                ? styles.currency__optionActive
                                                : ''
                                        }`}
                                        onClick={() =>
                                            onCurrencyChange(item.code)
                                        }
                                    >
                                        <span>{item.symbol}</span>

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

                    <div className={styles.menu__setting}>
                        <span className={styles.menu__settingLabel}>
                            {t('header.theme.light')}
                        </span>

                        <ThemeToggle />
                    </div>
                </div>
            </aside>
        </div>,
        document.body,
    );
};
