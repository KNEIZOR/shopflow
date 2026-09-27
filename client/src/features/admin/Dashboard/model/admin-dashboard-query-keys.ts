export const adminDashboardQueryKeys = {
    all: ['admin-dashboard'] as const,

    dashboard: () => [...adminDashboardQueryKeys.all, 'dashboard'] as const,
};
