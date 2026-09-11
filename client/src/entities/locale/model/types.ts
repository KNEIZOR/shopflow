import type { CountryCode, CurrencyCode, LanguageCode } from '@/shared/config';

export type LocaleState = {
    country: CountryCode;
    language: LanguageCode;
    currency: CurrencyCode;
    locale: string;
};

export type LocaleContextValue = LocaleState & {
    setCountry: (country: CountryCode) => void;
    setLanguage: (language: LanguageCode) => void;
    setCurrency: (currency: CurrencyCode) => void;
    setLocale: (locale: Partial<LocaleState>) => void;
};
