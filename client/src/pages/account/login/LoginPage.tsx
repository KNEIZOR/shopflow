import { LoginForm } from '@/features/auth/login';

import styles from './LoginPage.module.scss';

export const LoginPage = () => {
    return (
        <main className={styles.page}>
            <div className="container">
                <div className={styles.content}>
                    <LoginForm />
                </div>
            </div>
        </main>
    );
};
