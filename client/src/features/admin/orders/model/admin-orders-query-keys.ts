export const adminOrdersQueryKeys = {
    all: ['admin-orders'] as const,

    lists: () => [...adminOrdersQueryKeys.all, 'list'] as const,

    list: (params: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        paymentStatus?: string;
        sort?: string;
    }) => [...adminOrdersQueryKeys.lists(), params] as const,

    details: () => [...adminOrdersQueryKeys.all, 'detail'] as const,

    detail: (orderId: string) =>
        [...adminOrdersQueryKeys.details(), orderId] as const,
};
