export type LanguageCode = 'en' | 'ru';

export type LanguageConfig = {
    code: LanguageCode;
    flag: string;
    labelKey: string;
};

export const LANGUAGES: LanguageConfig[] = [
    {
        code: 'en',
        flag: '🇬🇧',
        labelKey: 'header.english',
    },
    {
        code: 'ru',
        flag: '🇷🇺',
        labelKey: 'header.russian',
    },
];
