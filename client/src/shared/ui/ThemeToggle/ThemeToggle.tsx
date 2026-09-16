import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/entities/theme';

import styles from './ThemeToggle.module.scss';

export const ThemeToggle = () => {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            className={`${styles.toggle} ${isDark ? styles.toggleDark : ''}`}
            onClick={toggleTheme}
            aria-label={
                isDark ? t('header.theme.light') : t('header.theme.dark')
            }
            title={isDark ? t('header.theme.light') : t('header.theme.dark')}
            aria-pressed={isDark}
        >
            <span className={styles.track}>
                <span className={styles.icon}>
                    {isDark ? (
                        <Moon size={15} strokeWidth={1.8} />
                    ) : (
                        <Sun size={15} strokeWidth={1.8} />
                    )}
                </span>
            </span>
        </button>
    );
};
