import { createBrowserRouter, type RouteObject } from 'react-router-dom';

import { AppLayout } from '@/components/layout/AppLayout/ui/AppLayout';

import {
    loadAdminFeatureTranslations,
    loadCartTranslations,
    loadCatalogTranslations,
    loadHomeTranslations,
    loadNotFoundTranslations,
    loadProductTranslations,
} from '@/i18n';

import i18n from '@/i18n';

const getCurrentLanguage = () => (i18n.language === 'ru' ? 'ru' : 'en');

const loadCurrentHomeTranslations = async (): Promise<null> => {
    await loadHomeTranslations(getCurrentLanguage());

    return null;
};

const loadCurrentCatalogTranslations = async (): Promise<null> => {
    await loadCatalogTranslations(getCurrentLanguage());

    return null;
};

const loadCurrentProductTranslations = async (): Promise<null> => {
    await loadProductTranslations(getCurrentLanguage());

    return null;
};

const loadCurrentCartTranslations = async (): Promise<null> => {
    await loadCartTranslations(getCurrentLanguage());

    return null;
};

const loadCurrentNotFoundTranslations = async (): Promise<null> => {
    await loadNotFoundTranslations(getCurrentLanguage());

    return null;
};

const loadCurrentAdminLayoutTranslations = async (): Promise<void> => {
    const language = getCurrentLanguage();

    await Promise.all([
        loadAdminFeatureTranslations(language, 'navigation'),
        loadAdminFeatureTranslations(language, 'sidebar'),
        loadAdminFeatureTranslations(language, 'header'),
    ]);
};

const loadCurrentAdminTranslations = (
    feature: 'auth' | 'dashboard' | 'categories' | 'productTypes' | 'products',
) => {
    return async (): Promise<null> => {
        await loadAdminFeatureTranslations(getCurrentLanguage(), feature);

        return null;
    };
};

const loadCurrentAdminPageTranslations = (
    feature: 'dashboard' | 'categories' | 'productTypes' | 'products',
) => {
    return async (): Promise<null> => {
        const language = getCurrentLanguage();

        await Promise.all([
            loadCurrentAdminLayoutTranslations(),
            loadAdminFeatureTranslations(language, feature),
        ]);

        return null;
    };
};

const homeRoute: RouteObject = {
    path: '/',
    loader: loadCurrentHomeTranslations,

    lazy: async () => {
        const { HomePage } = await import('@/pages/home/HomePage');

        return {
            Component: HomePage,
        };
    },
};

const catalogRoute: RouteObject = {
    path: '/catalog',
    loader: loadCurrentCatalogTranslations,

    lazy: async () => {
        const { CatalogPage } = await import('@/pages/catalog/ui/CatalogPage');

        return {
            Component: CatalogPage,
        };
    },
};

const productRoute: RouteObject = {
    path: '/product/:slug',
    loader: loadCurrentProductTranslations,

    lazy: async () => {
        const { ProductPage } =
            await import('@/pages/product/ui/ProductPage/ProductPage');

        return {
            Component: ProductPage,
        };
    },
};

const cartRoute: RouteObject = {
    path: '/cart',
    loader: loadCurrentCartTranslations,

    lazy: async () => {
        const { CartPage } = await import('@/pages/cart/ui/CartPage/CartPage');

        return {
            Component: CartPage,
        };
    },
};

const notFoundRoute: RouteObject = {
    path: '*',
    loader: loadCurrentNotFoundTranslations,

    lazy: async () => {
        const { NotFoundPage } = await import('@/pages/not-found/NotFoundPage');

        return {
            Component: NotFoundPage,
        };
    },
};

const adminLoginRoute: RouteObject = {
    path: '/admin/login',
    loader: loadCurrentAdminTranslations('auth'),

    lazy: async () => {
        const { AdminLoginPage } =
            await import('@/features/admin/auth/AdminLoginPage');

        return {
            Component: AdminLoginPage,
        };
    },
};

const adminRoute: RouteObject = {
    lazy: async () => {
        const { AdminRoute } =
            await import('@/features/admin/route/AdminRoute');

        return {
            Component: AdminRoute,
        };
    },

    children: [
        {
            path: '/admin',

            lazy: async () => {
                const { AdminLayout } =
                    await import('@/features/admin/layout/AdminLayout');

                return {
                    Component: AdminLayout,
                };
            },

            children: [
                {
                    index: true,
                    loader: loadCurrentAdminPageTranslations('dashboard'),

                    lazy: async () => {
                        const { AdminDashboardPage } =
                            await import('@/features/admin/Dashboard/AdminDashboardPage');

                        return {
                            Component: AdminDashboardPage,
                        };
                    },
                },

                {
                    path: 'products',
                    loader: loadCurrentAdminPageTranslations('products'),

                    lazy: async () => {
                        const { ProductsAdminPage } =
                            await import('@/features/admin/products/ProductsAdminPage');

                        return {
                            Component: ProductsAdminPage,
                        };
                    },
                },

                {
                    path: 'products/new',
                    loader: loadCurrentAdminPageTranslations('products'),

                    lazy: async () => {
                        const { ProductsCreatePage } =
                            await import('@/features/admin/products/create/ProductsCreatePage');

                        return {
                            Component: ProductsCreatePage,
                        };
                    },
                },

                {
                    path: 'categories',
                    loader: loadCurrentAdminPageTranslations('categories'),

                    lazy: async () => {
                        const { CategoriesAdminPage } =
                            await import('@/features/admin/categories/CategoriesAdminPage');

                        return {
                            Component: CategoriesAdminPage,
                        };
                    },
                },

                {
                    path: 'product-types',
                    loader: loadCurrentAdminPageTranslations('productTypes'),

                    lazy: async () => {
                        const { ProductTypesAdminPage } =
                            await import('@/features/admin/product-types/ProductTypesAdminPage');

                        return {
                            Component: ProductTypesAdminPage,
                        };
                    },
                },

                {
                    path: 'product/:slug',
                    loader: loadCurrentAdminPageTranslations('products'),

                    lazy: async () => {
                        const { ProductAdminPage } =
                            await import('@/features/admin/product/ui/ProductAdminPage/ProductAdminPage');

                        return {
                            Component: ProductAdminPage,
                        };
                    },
                },
            ],
        },
    ],
};

export const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            homeRoute,
            catalogRoute,
            productRoute,
            cartRoute,
            notFoundRoute,
        ],
    },

    adminLoginRoute,

    adminRoute,
]);
