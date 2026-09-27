import { useQuery } from '@tanstack/react-query';

import { getAdminDashboard } from './admin-dashboard-api';
import { adminDashboardQueryKeys } from './admin-dashboard-query-keys';

export const useAdminDashboard = () => {
    return useQuery({
        queryKey: adminDashboardQueryKeys.dashboard(),
        queryFn: getAdminDashboard,
        staleTime: 30_000,
    });
};
