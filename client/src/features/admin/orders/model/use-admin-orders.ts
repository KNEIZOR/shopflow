import { useQuery } from '@tanstack/react-query';

import { getAdminOrders } from './admin-orders-api';
import { adminOrdersQueryKeys } from './admin-orders-query-keys';
import type { AdminOrdersQuery } from './admin-orders.types';

export const useAdminOrders = (params: AdminOrdersQuery = {}) => {
    return useQuery({
        queryKey: adminOrdersQueryKeys.list(params),
        queryFn: () => getAdminOrders(params),
    });
};
