export const adminCategoryQueryKeys = {
    all: ['admin-categories'] as const,

    lists: () => [...adminCategoryQueryKeys.all, 'list'] as const,

    list: (language: string) =>
        [...adminCategoryQueryKeys.lists(), language] as const,

    details: () => [...adminCategoryQueryKeys.all, 'detail'] as const,

    detail: (id: string) => [...adminCategoryQueryKeys.details(), id] as const,

    translations: (id: string) =>
        [...adminCategoryQueryKeys.detail(id), 'translations'] as const,
};
