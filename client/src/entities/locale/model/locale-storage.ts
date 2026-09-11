import type { LocaleState } from './types';

const STORAGE_KEY = 'shopflow-locale';

export const getStoredLocale = (): Partial<LocaleState> | null => {
    try {
        const value = localStorage.getItem(STORAGE_KEY);

        if (!value) {
            return null;
        }

        return JSON.parse(value) as Partial<LocaleState>;
    } catch {
        return null;
    }
};

export const setStoredLocale = (locale: LocaleState): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locale));
};
