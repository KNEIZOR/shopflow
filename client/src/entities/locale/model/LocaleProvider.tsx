import { useMemo, useState, type ReactNode } from 'react';

import {
    getRegionByCountry,
    type CountryCode,
    type CurrencyCode,
    type LanguageCode,
} from '@/shared/config';
import { changeLanguage } from '@/i18n';

import { detectRegion } from './detect-region';
import { getStoredLocale, setStoredLocale } from './locale-storage';
import { LocaleContext } from './LocaleContext';
import type { LocaleContextValue, LocaleState } from './types';

type LocaleProviderProps = {
    children: ReactNode;
};

const createInitialLocale = (): LocaleState => {
    const storedLocale = getStoredLocale();

    if (storedLocale?.country) {
        const region = getRegionByCountry(storedLocale.country);

        return {
            country: storedLocale.country,
            language: storedLocale.language ?? region.language,
            currency: storedLocale.currency ?? region.currency,
            locale: storedLocale.locale ?? region.locale,
        };
    }

    const detectedRegion = detectRegion();

    return {
        country: detectedRegion.country,
        language: detectedRegion.language,
        currency: detectedRegion.currency,
        locale: detectedRegion.locale,
    };
};

export const LocaleProvider = ({ children }: LocaleProviderProps) => {
    const [localeState, setLocaleState] =
        useState<LocaleState>(createInitialLocale);

    const updateLocale = (nextLocale: LocaleState) => {
        setLocaleState(nextLocale);
        setStoredLocale(nextLocale);
    };

    const setCountry = (country: CountryCode) => {
        const region = getRegionByCountry(country);

        const nextLocale: LocaleState = {
            country: region.country,
            language: region.language,
            currency: region.currency,
            locale: region.locale,
        };

        updateLocale(nextLocale);

        void changeLanguage(region.language);
    };

    const setLanguage = (language: LanguageCode) => {
        const nextLocale: LocaleState = {
            ...localeState,
            language,
        };

        updateLocale(nextLocale);

        void changeLanguage(language);
    };

    const setCurrency = (currency: CurrencyCode) => {
        updateLocale({
            ...localeState,
            currency,
        });
    };

    const setLocale = (partialLocale: Partial<LocaleState>) => {
        const nextLocale: LocaleState = {
            ...localeState,
            ...partialLocale,
        };

        updateLocale(nextLocale);

        if (partialLocale.language) {
            void changeLanguage(partialLocale.language);
        }
    };

    const value = useMemo<LocaleContextValue>(
        () => ({
            ...localeState,
            setCountry,
            setLanguage,
            setCurrency,
            setLocale,
        }),
        [localeState],
    );

    return (
        <LocaleContext.Provider value={value}>
            {children}
        </LocaleContext.Provider>
    );
};
