export const addressQueryKeys = {
    all: ['addresses'] as const,

    list: () => [...addressQueryKeys.all, 'list'] as const,

    detail: (addressId: string) =>
        [...addressQueryKeys.all, 'detail', addressId] as const,
};
