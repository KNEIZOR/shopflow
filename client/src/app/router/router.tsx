import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '@/components/layout/AppLayout/ui/AppLayout';
import { HomePage } from '@/pages/home/HomePage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';
import { CatalogPage } from '@/pages/catalog';

export const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/catalog',
                element: <CatalogPage />,
            },
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
]);
