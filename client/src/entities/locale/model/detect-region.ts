import { DEFAULT_REGION, REGIONS, type RegionConfig } from '@/shared/config';

const getCountryFromNavigator = (): string | null => {
    if (typeof navigator === 'undefined') {
        return null;
    }

    const language = navigator.language;

    const country = language.split('-')[1];

    return country ? country.toUpperCase() : null;
};

export const detectRegion = (): RegionConfig => {
    const detectedCountry = getCountryFromNavigator();

    if (detectedCountry) {
        const region = REGIONS.find((item) => item.country === detectedCountry);

        if (region) {
            return region;
        }
    }

    const language = navigator.language?.split('-')[0];

    if (language) {
        const region = REGIONS.find((item) => item.language === language);

        if (region) {
            return region;
        }
    }

    return DEFAULT_REGION;
};
