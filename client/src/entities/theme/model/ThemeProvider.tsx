import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from 'react';

import { ThemeContext } from './theme.context';
import type { Theme, ThemePreference } from './theme.types';

const THEME_STORAGE_KEY = 'shopflow-theme';
const DEFAULT_THEME: Theme = 'dark';

const getSystemTheme = (): Theme => {
    if (typeof window === 'undefined') {
        return DEFAULT_THEME;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
};

const getInitialPreference = (): ThemePreference => {
    if (typeof window === 'undefined') {
        return DEFAULT_THEME;
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
    }

    return DEFAULT_THEME;
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const [preference, setPreference] =
        useState<ThemePreference>(getInitialPreference);

    const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme);

    const theme: Theme = preference === 'system' ? systemTheme : preference;

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
    }, [theme]);

    useEffect(() => {
        if (preference !== 'system') {
            return;
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (event: MediaQueryListEvent) => {
            setSystemTheme(event.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [preference]);

    const setTheme = useCallback((nextTheme: Theme) => {
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        setPreference(nextTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }, [setTheme, theme]);

    const value = useMemo(
        () => ({
            theme,
            preference,
            setTheme,
            toggleTheme,
        }),
        [preference, setTheme, theme, toggleTheme],
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};
