import { type FormEvent, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { ApiError } from '@/shared/api';

import { useAuth } from '@/entities/auth';

import styles from './AdminLoginPage.module.scss';

type LocationState = {
    from?: string;
};

export const AdminLoginPage = () => {
    const { t } = useTranslation();

    const { user, isLoading, isAdmin, login } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const locationState = location.state as LocationState | null;

    const redirectPath = locationState?.from ?? '/admin';

    useEffect(() => {
        if (user && isAdmin) {
            navigate(redirectPath, {
                replace: true,
            });
        }
    }, [user, isAdmin, navigate, redirectPath]);

    if (isLoading) {
        return (
            <main className={styles.page}>
                <div className={styles.loading}>{t('common.loading')}</div>
            </main>
        );
    }

    if (user && isAdmin) {
        return <Navigate to={redirectPath} replace />;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const normalizedEmail = email.trim().toLowerCase();

        const trimmedPassword = password.trim();

        if (!normalizedEmail || !trimmedPassword) {
            setErrorMessage(t('admin.auth.validation'));

            return;
        }

        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            const authenticatedUser = await login({
                email: normalizedEmail,
                password: trimmedPassword,
            });

            if (authenticatedUser.role !== 'ADMIN') {
                setErrorMessage(t('admin.auth.accessDenied'));

                return;
            }

            navigate(redirectPath, {
                replace: true,
            });
        } catch (error) {
            if (
                error instanceof ApiError &&
                error.code === 'INVALID_CREDENTIALS'
            ) {
                setErrorMessage(t('admin.auth.invalidCredentials'));

                return;
            }

            setErrorMessage(
                error instanceof Error ? error.message : t('common.error'),
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className={styles.page}>
            <section className={styles.card}>
                <div className={styles.brand}>
                    <span className={styles.brandMark}>S</span>

                    <div>
                        <strong>ShopFlow</strong>

                        <span>{t('admin.auth.brandLabel')}</span>
                    </div>
                </div>

                <div className={styles.header}>
                    <p className={styles.eyebrow}>{t('admin.auth.eyebrow')}</p>

                    <h1 className={styles.title}>{t('admin.auth.title')}</h1>

                    <p className={styles.description}>
                        {t('admin.auth.description')}
                    </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.field}>
                        <span>{t('admin.auth.email')}</span>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="username"
                            placeholder={t('admin.auth.emailPlaceholder')}
                            disabled={isSubmitting}
                        />
                    </label>

                    <label className={styles.field}>
                        <span>{t('admin.auth.password')}</span>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            autoComplete="current-password"
                            placeholder={t('admin.auth.passwordPlaceholder')}
                            disabled={isSubmitting}
                        />
                    </label>

                    {errorMessage && (
                        <div className={styles.error} role="alert">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? t('admin.auth.signingIn')
                            : t('admin.auth.signIn')}
                    </button>
                </form>

                <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => navigate('/')}
                >
                    {t('admin.auth.backToStore')}
                </button>
            </section>
        </main>
    );
};
