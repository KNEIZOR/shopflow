import { useTranslation } from 'react-i18next';

import { changeLanguage } from '@/i18n';

import type { LanguageCode } from '@/shared/config/languages';

import styles from './LanguageSwitcher.module.scss';

const LANGUAGES: ReadonlyArray<{
    code: LanguageCode;
    label: string;
}> = [
    {
        code: 'ru',
        label: 'RU',
    },
    {
        code: 'en',
        label: 'EN',
    },
];

export const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();

    const handleLanguageChange = async (
        language: LanguageCode,
    ): Promise<void> => {
        if (language === i18n.resolvedLanguage) {
            return;
        }

        try {
            await changeLanguage(language);
        } catch (error) {
            console.error('Failed to change language:', error);
        }
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
                        onClick={() => {
                            void handleLanguageChange(language.code);
                        }}
                        aria-pressed={isActive}
                    >
                        {language.label}
                    </button>
                );
            })}
        </div>
    );
};
