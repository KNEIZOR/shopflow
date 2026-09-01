import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';

const getInitialLanguage = () => {
    const savedLanguage = localStorage.getItem('shopflow-language');

    if (savedLanguage === 'ru' || savedLanguage === 'en') {
        return savedLanguage;
    }

    const browserLanguage = navigator.language.toLowerCase();

    return browserLanguage.startsWith('ru') ? 'ru' : 'en';
};

void i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: en,
        },
        ru: {
            translation: ru,
        },
    },

    lng: getInitialLanguage(),
    fallbackLng: 'en',

    interpolation: {
        escapeValue: false,
    },
});

i18n.on('languageChanged', (language) => {
    localStorage.setItem('shopflow-language', language);

    document.documentElement.lang = language;
});

document.documentElement.lang = i18n.language;

export default i18n;
