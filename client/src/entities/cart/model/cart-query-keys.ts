import type { CurrencyCode } from '@/shared/config/currencies';

export const cartQueryKeys = {
    all: ['cart'] as const,

    detail: (currency: CurrencyCode) =>
        [...cartQueryKeys.all, 'detail', currency] as const,
};
