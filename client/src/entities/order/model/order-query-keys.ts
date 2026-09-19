export const orderQueryKeys = {
    all: ['orders'] as const,

    list: () => [...orderQueryKeys.all, 'list'] as const,

    detail: (orderId: string) =>
        [...orderQueryKeys.all, 'detail', orderId] as const,
};
