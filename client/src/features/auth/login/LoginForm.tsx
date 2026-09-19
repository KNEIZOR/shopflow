import { useEffect, useState, type FormEvent } from 'react';
import {
    Link,
    useLocation,
    useNavigate,
    type Location,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/entities/auth';
import { ApiError } from '@/shared/api';

import styles from './LoginForm.module.scss';

type LoginFormState = {
    email: string;
    password: string;
};

type LoginErrors = {
    email: string;
    password: string;
    submit: string;
};

type AuthLocationState = {
    from?: string;
};

const getRedirectPath = (location: Location): string => {
    const state = location.state as AuthLocationState | null;

    const from = state?.from;

    if (
        typeof from === 'string' &&
        from.startsWith('/') &&
        !from.startsWith('//')
    ) {
        return from;
    }

    return '/account';
};

export const LoginForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const { login, isAuthenticated } = useAuth();

    const redirectPath = getRedirectPath(location);

    const [form, setForm] = useState<LoginFormState>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<LoginErrors>({
        email: '',
        password: '',
        submit: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        void navigate(redirectPath, { replace: true });
    }, [isAuthenticated, navigate, redirectPath]);

    if (isAuthenticated) {
        return null;
    }

    const handleChange = (field: keyof LoginFormState, value: string): void => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: '',
            submit: '',
        }));
    };

    const validate = (): boolean => {
        const nextErrors: LoginErrors = {
            email: '',
            password: '',
            submit: '',
        };

        const email = form.email.trim();

        if (!email) {
            nextErrors.email = t('auth.validation.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            nextErrors.email = t('auth.validation.emailInvalid');
        }

        if (!form.password) {
            nextErrors.password = t('auth.validation.passwordRequired');
        }

        setErrors(nextErrors);

        return !nextErrors.email && !nextErrors.password;
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await login({
                email: form.email.trim(),
                password: form.password,
            });

            await navigate(redirectPath, { replace: true });
        } catch (error) {
            if (
                error instanceof ApiError &&
                error.code === 'INVALID_CREDENTIALS'
            ) {
                setErrors((current) => ({
                    ...current,
                    submit: t('auth.login.invalidCredentials'),
                }));
            } else {
                setErrors((current) => ({
                    ...current,
                    submit: t('auth.login.genericError'),
                }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formWrapper}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('auth.login.title')}</h1>

                <p className={styles.description}>
                    {t('auth.login.description')}
                </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.field}>
                    <label htmlFor="login-email" className={styles.label}>
                        {t('auth.login.email')}
                    </label>

                    <input
                        id="login-email"
                        className={`${styles.input} ${
                            errors.email ? styles.inputError : ''
                        }`}
                        type="email"
                        name="email"
                        value={form.email}
                        placeholder={t('auth.login.emailPlaceholder')}
                        autoComplete="email"
                        disabled={isSubmitting}
                        onChange={(event) =>
                            handleChange('email', event.target.value)
                        }
                    />

                    {errors.email && (
                        <p className={styles.error}>{errors.email}</p>
                    )}
                </div>

                <div className={styles.field}>
                    <label htmlFor="login-password" className={styles.label}>
                        {t('auth.login.password')}
                    </label>

                    <div className={styles.passwordWrapper}>
                        <input
                            id="login-password"
                            className={`${styles.input} ${
                                errors.password ? styles.inputError : ''
                            }`}
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={form.password}
                            placeholder={t('auth.login.passwordPlaceholder')}
                            autoComplete="current-password"
                            disabled={isSubmitting}
                            onChange={(event) =>
                                handleChange('password', event.target.value)
                            }
                        />

                        <button
                            type="button"
                            className={styles.passwordToggle}
                            disabled={isSubmitting}
                            aria-label={
                                showPassword
                                    ? t('auth.password.hide')
                                    : t('auth.password.show')
                            }
                            onClick={() =>
                                setShowPassword((current) => !current)
                            }
                        >
                            •••
                        </button>
                    </div>

                    {errors.password && (
                        <p className={styles.error}>{errors.password}</p>
                    )}
                </div>

                {errors.submit && (
                    <div className={styles.submitError} role="alert">
                        {errors.submit}
                    </div>
                )}

                <button
                    type="submit"
                    className={styles.submit}
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? t('auth.login.loading')
                        : t('auth.login.submit')}
                </button>
            </form>

            <div className={styles.footer}>
                <span>{t('auth.login.noAccount')}</span>

                <Link
                    to="/account/register"
                    state={{ from: redirectPath }}
                    className={styles.link}
                >
                    {t('auth.login.register')}
                </Link>
            </div>
        </div>
    );
};
