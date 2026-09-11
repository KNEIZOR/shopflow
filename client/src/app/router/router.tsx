import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '@/components/layout/AppLayout/ui/AppLayout';

import { CatalogPage } from '@/pages/catalog';
import { HomePage } from '@/pages/home/HomePage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';
import { ProductPage } from '@/pages/product';

import { ProductAdminPage } from '@/features/admin/product/ui';

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
                path: '/product/:slug',
                element: <ProductPage />,
            },

            {
                path: '/admin/product/:slug',
                element: <ProductAdminPage />,
            },

            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
]);
