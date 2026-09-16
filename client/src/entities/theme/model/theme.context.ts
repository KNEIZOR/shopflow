import { createContext } from 'react';

import type { Theme, ThemePreference } from './theme.types';

export type ThemeContextValue = {
    theme: Theme;
    preference: ThemePreference;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
