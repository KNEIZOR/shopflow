import { type PropsWithChildren, useCallback, useMemo } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    getCurrentUser,
    login as loginRequest,
    logout as logoutRequest,
    register as registerRequest,
    updatePassword as updatePasswordRequest,
    updateProfile as updateProfileRequest,
} from '../api/auth-api';

import { AuthContext } from './AuthContext';

import type {
    AuthUser,
    LoginInput,
    RegisterInput,
    UpdatePasswordInput,
    UpdateProfileInput,
} from './types';

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

    const registerMutation = useMutation({
        mutationFn: registerRequest,

        onSuccess: (registeredUser) => {
            queryClient.setQueryData(AUTH_QUERY_KEY, registeredUser);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: logoutRequest,

        onSuccess: () => {
            queryClient.setQueryData(AUTH_QUERY_KEY, null);
        },
    });

    const updateProfileMutation = useMutation({
        mutationFn: updateProfileRequest,

        onSuccess: (updatedUser) => {
            queryClient.setQueryData(AUTH_QUERY_KEY, updatedUser);
        },
    });

    const updatePasswordMutation = useMutation({
        mutationFn: updatePasswordRequest,
    });

    const login = useCallback(
        async (input: LoginInput): Promise<AuthUser> => {
            return loginMutation.mutateAsync(input);
        },
        [loginMutation],
    );

    const register = useCallback(
        async (input: RegisterInput): Promise<AuthUser> => {
            return registerMutation.mutateAsync(input);
        },
        [registerMutation],
    );

    const logout = useCallback(async (): Promise<void> => {
        await logoutMutation.mutateAsync();
    }, [logoutMutation]);

    const updateProfile = useCallback(
        async (input: UpdateProfileInput): Promise<AuthUser> => {
            return updateProfileMutation.mutateAsync(input);
        },
        [updateProfileMutation],
    );

    const updatePassword = useCallback(
        async (input: UpdatePasswordInput): Promise<void> => {
            await updatePasswordMutation.mutateAsync(input);
        },
        [updatePasswordMutation],
    );

    const isAuthenticated = Boolean(user);

    const isAdmin = user?.role === 'ADMIN';

    const contextValue = useMemo(
        () => ({
            user,
            isLoading,
            isAuthenticated,
            isAdmin,
            login,
            register,
            logout,
            updateProfile,
            updatePassword,
        }),
        [
            user,
            isLoading,
            isAuthenticated,
            isAdmin,
            login,
            register,
            logout,
            updateProfile,
            updatePassword,
        ],
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
