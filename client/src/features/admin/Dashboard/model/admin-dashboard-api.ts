import { apiRequest } from '@/shared/api';

import type { ApiResponse } from '@/shared/api/types';

import type { AdminDashboard } from './admin-dashboard.types';

export const getAdminDashboard = async (): Promise<AdminDashboard> => {
    const response =
        await apiRequest<ApiResponse<AdminDashboard>>('/admin/dashboard');

    return response.data;
};
