import { createContext } from 'react';

import type { AuthUser, LoginInput } from './types';

export type AuthContextValue = {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (input: LoginInput) => Promise<AuthUser>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
