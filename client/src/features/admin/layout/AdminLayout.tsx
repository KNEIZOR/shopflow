import { Outlet } from 'react-router-dom';

import { AdminHeader } from '../Header/AdminHeader';
import { AdminSidebar } from '../Sidebar/AdminSidebar';

import styles from './AdminLayout.module.scss';

export const AdminLayout = () => {
    return (
        <div className={styles.layout}>
            <AdminSidebar />

            <div className={styles.main}>
                <AdminHeader />

                <main className={styles.content}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
