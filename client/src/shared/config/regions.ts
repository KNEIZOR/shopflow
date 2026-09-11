import type { CurrencyCode } from './currencies';
import type { LanguageCode } from './languages';

export type CountryCode = 'RU' | 'US' | 'GB' | 'DE' | 'FR';

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
        country: 'GB',
        language: 'en',
        currency: 'GBP',
        locale: 'en-GB',
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
