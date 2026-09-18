import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { CategoriesIcon } from '../icons/CategoriesIcon';
import { DashboardIcon } from '../icons/DashboardIcon';
import { OrdersIcon } from '../icons/OrdersIcon';
import { ProductsIcon } from '../icons/ProductsIcon';
import { ReviewsIcon } from '../icons/ReviewsIcon';
import { StoreIcon } from '../icons/StoreIcon';
import { UsersIcon } from '../icons/UsersIcon';

import styles from './AdminSidebar.module.scss';

const ADMIN_NAVIGATION = [
    {
        id: 'dashboard',
        path: '/admin',
        labelKey: 'admin.navigation.dashboard',
        icon: DashboardIcon,
        end: true,
    },
    {
        id: 'products',
        path: '/admin/products',
        labelKey: 'admin.navigation.products',
        icon: ProductsIcon,
        end: false,
    },
    {
        id: 'product-types',
        path: '/admin/product-types',
        labelKey: 'admin.navigation.productTypes',
        icon: ProductsIcon,
        end: false,
    },
    {
        id: 'categories',
        path: '/admin/categories',
        labelKey: 'admin.navigation.categories',
        icon: CategoriesIcon,
        end: false,
    },
    {
        id: 'orders',
        path: '/admin/orders',
        labelKey: 'admin.navigation.orders',
        icon: OrdersIcon,
        end: false,
    },
    {
        id: 'users',
        path: '/admin/users',
        labelKey: 'admin.navigation.users',
        icon: UsersIcon,
        end: false,
    },
    {
        id: 'reviews',
        path: '/admin/reviews',
        labelKey: 'admin.navigation.reviews',
        icon: ReviewsIcon,
        end: false,
    },
] as const;

export const AdminSidebar = () => {
    const { t } = useTranslation();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <span className={styles.brandMark}>S</span>

                <div>
                    <strong className={styles.brandName}>ShopFlow</strong>

                    <span className={styles.brandLabel}>
                        {t('admin.sidebar.label')}
                    </span>
                </div>
            </div>

            <nav
                className={styles.navigation}
                aria-label={t('admin.navigation.title')}
            >
                <p className={styles.navigationLabel}>
                    {t('admin.navigation.title')}
                </p>

                <div className={styles.links}>
                    {ADMIN_NAVIGATION.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) =>
                                    `${styles.link} ${
                                        isActive ? styles.active : ''
                                    }`
                                }
                            >
                                <Icon />

                                <span>{t(item.labelKey)}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            <NavLink to="/" className={styles.storeLink}>
                <StoreIcon />

                <span>{t('admin.sidebar.backToStore')}</span>
            </NavLink>
        </aside>
    );
};
