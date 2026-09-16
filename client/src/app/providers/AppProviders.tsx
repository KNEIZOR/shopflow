import type { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '@/entities/auth';
import { LocaleProvider } from '@/entities/locale';
import { ThemeProvider } from '@/entities/theme';
import { ToastProvider } from '@/shared/ui/Toast';

import '@/i18n';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

export const AppProviders = ({ children }: PropsWithChildren) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <LocaleProvider>
                    <AuthProvider>
                        <ToastProvider>{children}</ToastProvider>
                    </AuthProvider>
                </LocaleProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
};
