import type { CurrencyCode } from '@/shared/config/currencies';

import { getCurrencyConfig } from '@/shared/config/currencies';

export const formatCurrency = (
    amount: string | number,
    currency: CurrencyCode,
): string => {
    const config = getCurrencyConfig(currency);
    const value = Number(amount);

    if (!Number.isFinite(value)) {
        return `${amount}${config.symbol}`;
    }

    return `${value.toLocaleString('en-US', {
        minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
        maximumFractionDigits: config.fractionDigits,
    })}${config.symbol}`;
};
