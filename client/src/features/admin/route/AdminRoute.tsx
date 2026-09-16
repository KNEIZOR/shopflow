import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/entities/auth';

export const AdminRoute = () => {
    const { user, isLoading, isAdmin } = useAuth();

    const location = useLocation();

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'grid',
                    placeItems: 'center',
                }}
            >
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/admin/login"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
