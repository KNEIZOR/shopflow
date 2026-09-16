export type CurrencyCode = 'USD' | 'EUR' | 'AMD' | 'RUB';

export type CurrencyConfig = {
    code: CurrencyCode;
    symbol: string;
    fractionDigits: number;
};

export const CURRENCIES: CurrencyConfig[] = [
    {
        code: 'USD',
        symbol: '$',
        fractionDigits: 2,
    },
    {
        code: 'EUR',
        symbol: '€',
        fractionDigits: 2,
    },
    {
        code: 'AMD',
        symbol: '֏',
        fractionDigits: 2,
    },
    {
        code: 'RUB',
        symbol: '₽',
        fractionDigits: 2,
    },
];

export const getCurrencyConfig = (currency: CurrencyCode): CurrencyConfig => {
    return CURRENCIES.find((item) => item.code === currency) ?? CURRENCIES[0];
};
