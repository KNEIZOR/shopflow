export type AdminDashboardStats = {
    products: number;
    orders: number;
    users: number;
    revenue: string;
    revenueCurrency: string;
};

export type AdminDashboardOrderStatuses = {
    PENDING: number;
    CONFIRMED: number;
    PROCESSING: number;
    SHIPPED: number;
    DELIVERED: number;
    CANCELLED: number;
};

export type AdminDashboardRecentOrder = {
    id: string;
    total: string;
    currency: string;
    status: string;
    paymentStatus: string;
    createdAt: string;
    itemsCount: number;

    customer: {
        id: string;
        name: string;
        email: string;
    };
};

export type AdminDashboard = {
    stats: AdminDashboardStats;
    orderStatuses: AdminDashboardOrderStatuses;
    recentOrders: AdminDashboardRecentOrder[];
};
