export const favoriteQueryKeys = {
    all: ['favorites'] as const,

    list: (language: string, currency: string) =>
        ['favorites', 'list', language, currency] as const,
};
