import { RegisterForm } from '@/features/auth/register';

import styles from './RegisterPage.module.scss';

export const RegisterPage = () => {
    return (
        <main className={styles.page}>
            <div className="container">
                <div className={styles.content}>
                    <RegisterForm />
                </div>
            </div>
        </main>
    );
};
