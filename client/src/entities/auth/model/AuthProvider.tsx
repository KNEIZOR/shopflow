import { type PropsWithChildren, useCallback, useMemo } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    getCurrentUser,
    login as loginRequest,
    logout as logoutRequest,
} from '../api/auth-api';

import { AuthContext } from './AuthContext';

import type { AuthUser, LoginInput } from './types';

const AUTH_QUERY_KEY = ['auth', 'me'] as const;

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const queryClient = useQueryClient();

    const { data: user = null, isLoading } = useQuery({
        queryKey: AUTH_QUERY_KEY,
        queryFn: getCurrentUser,

        retry: false,

        staleTime: 5 * 60 * 1000,

        refetchOnWindowFocus: false,

        throwOnError: false,
    });

    const loginMutation = useMutation({
        mutationFn: loginRequest,

        onSuccess: (authenticatedUser) => {
            queryClient.setQueryData(AUTH_QUERY_KEY, authenticatedUser);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: logoutRequest,

        onSuccess: () => {
            queryClient.setQueryData(AUTH_QUERY_KEY, null);
        },
    });

    const login = useCallback(
        async (input: LoginInput): Promise<AuthUser> => {
            return loginMutation.mutateAsync(input);
        },
        [loginMutation],
    );

    const logout = useCallback(async (): Promise<void> => {
        await logoutMutation.mutateAsync();
    }, [logoutMutation]);

    const isAuthenticated = Boolean(user);

    const isAdmin = user?.role === 'ADMIN';

    const contextValue = useMemo(
        () => ({
            user,
            isLoading,
            isAuthenticated,
            isAdmin,
            login,
            logout,
        }),
        [user, isLoading, isAuthenticated, isAdmin, login, logout],
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
