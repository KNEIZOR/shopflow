export const adminProductQueryKeys = {
    all: ['admin-products'] as const,

    lists: () => [...adminProductQueryKeys.all, 'list'] as const,

    list: (params: Record<string, unknown>) =>
        [...adminProductQueryKeys.lists(), params] as const,

    details: () => [...adminProductQueryKeys.all, 'detail'] as const,

    detail: (slug: string, language: string, currency: string) =>
        [...adminProductQueryKeys.details(), slug, language, currency] as const,
};
