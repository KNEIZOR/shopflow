import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/entities/auth';
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher';

import styles from './AdminHeader.module.scss';

export const AdminHeader = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);

        try {
            await logout();

            navigate('/admin/login', {
                replace: true,
            });
        } catch (error) {
            console.error('Failed to logout:', error);

            setIsLoggingOut(false);
        }
    };

    const userName =
        user?.firstName ||
        user?.lastName ||
        user?.email ||
        t('admin.header.admin');

    const userInitial =
        user?.firstName?.charAt(0).toUpperCase() ||
        user?.email?.charAt(0).toUpperCase() ||
        'A';

    return (
        <header className={styles.header}>
            <div>
                <p className={styles.eyebrow}>{t('admin.header.eyebrow')}</p>

                <h1 className={styles.title}>{t('admin.header.title')}</h1>
            </div>

            <div className={styles.actions}>
                <LanguageSwitcher />

                <div className={styles.user}>
                    <div className={styles.avatar}>{userInitial}</div>

                    <div className={styles.userInfo}>
                        <strong>{userName}</strong>

                        <span>{t('admin.header.role')}</span>
                    </div>
                </div>

                <button
                    type="button"
                    className={styles.logoutButton}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                >
                    {isLoggingOut
                        ? t('admin.header.loggingOut')
                        : t('admin.header.logout')}
                </button>
            </div>
        </header>
    );
};
