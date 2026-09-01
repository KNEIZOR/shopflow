import { useTranslation } from 'react-i18next';

import styles from './LanguageSwitcher.module.scss';

const LANGUAGES = [
    {
        code: 'ru',
        label: 'RU',
    },
    {
        code: 'en',
        label: 'EN',
    },
] as const;

export const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();

    const changeLanguage = (language: string) => {
        void i18n.changeLanguage(language);
    };

    return (
        <div
            className={styles.switcher}
            role="group"
            aria-label={t('language.label')}
        >
            {LANGUAGES.map((language) => {
                const isActive = i18n.resolvedLanguage === language.code;

                return (
                    <button
                        key={language.code}
                        type="button"
                        className={`${styles.button} ${
                            isActive ? styles.active : ''
                        }`}
                        onClick={() => changeLanguage(language.code)}
                        aria-pressed={isActive}
                    >
                        {language.label}
                    </button>
                );
            })}
        </div>
    );
};
