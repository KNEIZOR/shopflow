import { useQuery } from '@tanstack/react-query';

import { getAdminOrderById } from './admin-orders-api';
import { adminOrdersQueryKeys } from './admin-orders-query-keys';

export const useAdminOrder = (orderId: string) => {
    return useQuery({
        queryKey: adminOrdersQueryKeys.detail(orderId),
        queryFn: () => getAdminOrderById(orderId),
        enabled: Boolean(orderId),
    });
};
