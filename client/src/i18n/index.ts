import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';

import type { LanguageCode } from '@/shared/config/languages';

const STORAGE_KEY = 'shopflow-language';

const savedLanguage = localStorage.getItem(STORAGE_KEY);

const initialLanguage: LanguageCode =
    savedLanguage === 'ru' || savedLanguage === 'en' ? savedLanguage : 'en';

void i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: en,
        },
        ru: {
            translation: ru,
        },
    },

    lng: initialLanguage,

    fallbackLng: 'en',

    interpolation: {
        escapeValue: false,
    },
});

export const changeLanguage = async (language: LanguageCode): Promise<void> => {
    await i18n.changeLanguage(language);

    localStorage.setItem(STORAGE_KEY, language);
};

export default i18n;
