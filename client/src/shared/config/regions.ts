import type { CurrencyCode } from './currencies';
import type { LanguageCode } from './languages';

export type CountryCode = 'RU' | 'US' | 'AM' | 'DE' | 'FR';

export type RegionConfig = {
    country: CountryCode;
    language: LanguageCode;
    currency: CurrencyCode;
    locale: string;
};

export const REGIONS: RegionConfig[] = [
    {
        country: 'RU',
        language: 'ru',
        currency: 'RUB',
        locale: 'ru-RU',
    },
    {
        country: 'US',
        language: 'en',
        currency: 'USD',
        locale: 'en-US',
    },
    {
        country: 'AM',
        language: 'en',
        currency: 'AMD',
        locale: 'en-AM',
    },
    {
        country: 'DE',
        language: 'en',
        currency: 'EUR',
        locale: 'en-DE',
    },
    {
        country: 'FR',
        language: 'en',
        currency: 'EUR',
        locale: 'en-FR',
    },
];

export const DEFAULT_REGION: RegionConfig = REGIONS[1];

export const getRegionByCountry = (country: CountryCode): RegionConfig => {
    return (
        REGIONS.find((region) => region.country === country) ?? DEFAULT_REGION
    );
};
