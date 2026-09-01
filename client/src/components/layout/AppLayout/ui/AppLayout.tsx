import { Outlet } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

import styles from './AppLayout.module.scss';

export const AppLayout = () => {
    return (
        <div className={styles.app}>
            <Header />

            <main className={styles.main}>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};
