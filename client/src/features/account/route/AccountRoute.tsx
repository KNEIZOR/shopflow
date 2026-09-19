import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/entities/auth';

export const AccountRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return (
            <Navigate to="/account/login" replace state={{ from: location }} />
        );
    }

    return <Outlet />;
};
