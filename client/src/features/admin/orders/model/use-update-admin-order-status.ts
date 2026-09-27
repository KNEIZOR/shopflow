import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    adminOrdersQueryKeys,
    updateAdminOrderStatus,
} from '@/features/admin/orders';

import type {
    AdminOrderStatus,
    UpdateAdminOrderStatusInput,
} from './admin-orders.types';

interface UpdateAdminOrderStatusVariables {
    orderId: string;
    status: AdminOrderStatus;
}

export const useUpdateAdminOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, status }: UpdateAdminOrderStatusVariables) =>
            updateAdminOrderStatus(orderId, {
                status,
            } satisfies UpdateAdminOrderStatusInput),

        onSuccess: (updatedOrder) => {
            queryClient.setQueryData(
                adminOrdersQueryKeys.detail(updatedOrder.id),
                updatedOrder,
            );

            void queryClient.invalidateQueries({
                queryKey: adminOrdersQueryKeys.lists(),
            });
        },
    });
};
