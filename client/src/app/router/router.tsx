import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '@/components/layout/AppLayout/ui/AppLayout';

import {
    AdminDashboardPage,
    AdminLayout,
    AdminLoginPage,
    AdminRoute,
} from '@/features/admin';

import { ProductAdminPage } from '@/features/admin/product/ui';

import { CatalogPage } from '@/pages/catalog';
import { HomePage } from '@/pages/home/HomePage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';
import { ProductPage } from '@/pages/product';
import { ProductsAdminPage, ProductsCreatePage } from '@/features/admin/products';

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
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },

    {
        path: '/admin/login',
        element: <AdminLoginPage />,
    },

    {
        element: <AdminRoute />,

        children: [
            {
                path: '/admin',
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <AdminDashboardPage />,
                    },
                    {
                        path: 'products',
                        element: <ProductsAdminPage />,
                    },
                    {
                        path: 'products/new',
                        element: <ProductsCreatePage />,
                    },
                    {
                        path: 'product/:slug',
                        element: <ProductAdminPage />,
                    },
                ],
            },
        ],
    },
]);
