import { createContext } from 'react';

import type {
    AuthUser,
    LoginInput,
    RegisterInput,
    UpdatePasswordInput,
    UpdateProfileInput,
} from './types';

export type AuthContextValue = {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;

    login: (input: LoginInput) => Promise<AuthUser>;

    register: (input: RegisterInput) => Promise<AuthUser>;

    logout: () => Promise<void>;

    updateProfile: (input: UpdateProfileInput) => Promise<AuthUser>;

    updatePassword: (input: UpdatePasswordInput) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
