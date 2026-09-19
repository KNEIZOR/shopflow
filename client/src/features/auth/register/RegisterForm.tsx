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

import styles from './RegisterForm.module.scss';

type RegisterFormState = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type RegisterErrors = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
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

export const RegisterForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const { register, isAuthenticated } = useAuth();

    const redirectPath = getRedirectPath(location);

    const [form, setForm] = useState<RegisterFormState>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<RegisterErrors>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        submit: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        void navigate(redirectPath, { replace: true });
    }, [isAuthenticated, navigate, redirectPath]);

    if (isAuthenticated) {
        return null;
    }

    const handleChange = (
        field: keyof RegisterFormState,
        value: string,
    ): void => {
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
        const nextErrors: RegisterErrors = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            submit: '',
        };

        const firstName = form.firstName.trim();
        const lastName = form.lastName.trim();
        const email = form.email.trim();

        if (firstName.length > 50) {
            nextErrors.firstName = t('auth.validation.firstNameMax');
        }

        if (lastName.length > 50) {
            nextErrors.lastName = t('auth.validation.lastNameMax');
        }

        if (!email) {
            nextErrors.email = t('auth.validation.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            nextErrors.email = t('auth.validation.emailInvalid');
        }

        if (!form.password) {
            nextErrors.password = t('auth.validation.passwordRequired');
        } else if (form.password.length < 6) {
            nextErrors.password = t('auth.validation.passwordMin');
        }

        if (form.password !== form.confirmPassword) {
            nextErrors.confirmPassword = t('auth.register.passwordMismatch');
        }

        setErrors(nextErrors);

        return Object.values(nextErrors).every((error) => !error);
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
            await register({
                email: form.email.trim(),
                password: form.password,
                firstName: form.firstName.trim() || undefined,
                lastName: form.lastName.trim() || undefined,
            });

            await navigate(redirectPath, { replace: true });
        } catch (error) {
            if (
                error instanceof ApiError &&
                error.code === 'USER_ALREADY_EXISTS'
            ) {
                setErrors((current) => ({
                    ...current,
                    submit: t('auth.register.userAlreadyExists'),
                }));
            } else {
                setErrors((current) => ({
                    ...current,
                    submit: t('auth.register.genericError'),
                }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formWrapper}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('auth.register.title')}</h1>

                <p className={styles.description}>
                    {t('auth.register.description')}
                </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.nameGrid}>
                    <div className={styles.field}>
                        <label
                            htmlFor="register-first-name"
                            className={styles.label}
                        >
                            {t('auth.register.firstName')}
                        </label>

                        <input
                            id="register-first-name"
                            className={`${styles.input} ${
                                errors.firstName ? styles.inputError : ''
                            }`}
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            placeholder={t(
                                'auth.register.firstNamePlaceholder',
                            )}
                            autoComplete="given-name"
                            disabled={isSubmitting}
                            onChange={(event) =>
                                handleChange('firstName', event.target.value)
                            }
                        />

                        {errors.firstName && (
                            <p className={styles.error}>{errors.firstName}</p>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label
                            htmlFor="register-last-name"
                            className={styles.label}
                        >
                            {t('auth.register.lastName')}
                        </label>

                        <input
                            id="register-last-name"
                            className={`${styles.input} ${
                                errors.lastName ? styles.inputError : ''
                            }`}
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            placeholder={t('auth.register.lastNamePlaceholder')}
                            autoComplete="family-name"
                            disabled={isSubmitting}
                            onChange={(event) =>
                                handleChange('lastName', event.target.value)
                            }
                        />

                        {errors.lastName && (
                            <p className={styles.error}>{errors.lastName}</p>
                        )}
                    </div>
                </div>

                <div className={styles.field}>
                    <label htmlFor="register-email" className={styles.label}>
                        {t('auth.register.email')}
                    </label>

                    <input
                        id="register-email"
                        className={`${styles.input} ${
                            errors.email ? styles.inputError : ''
                        }`}
                        type="email"
                        name="email"
                        value={form.email}
                        placeholder={t('auth.register.emailPlaceholder')}
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
                    <label htmlFor="register-password" className={styles.label}>
                        {t('auth.register.password')}
                    </label>

                    <div className={styles.passwordWrapper}>
                        <input
                            id="register-password"
                            className={`${styles.input} ${
                                errors.password ? styles.inputError : ''
                            }`}
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={form.password}
                            placeholder={t('auth.register.passwordPlaceholder')}
                            autoComplete="new-password"
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

                <div className={styles.field}>
                    <label
                        htmlFor="register-confirm-password"
                        className={styles.label}
                    >
                        {t('auth.register.confirmPassword')}
                    </label>

                    <div className={styles.passwordWrapper}>
                        <input
                            id="register-confirm-password"
                            className={`${styles.input} ${
                                errors.confirmPassword ? styles.inputError : ''
                            }`}
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={form.confirmPassword}
                            placeholder={t(
                                'auth.register.confirmPasswordPlaceholder',
                            )}
                            autoComplete="new-password"
                            disabled={isSubmitting}
                            onChange={(event) =>
                                handleChange(
                                    'confirmPassword',
                                    event.target.value,
                                )
                            }
                        />

                        <button
                            type="button"
                            className={styles.passwordToggle}
                            disabled={isSubmitting}
                            aria-label={
                                showConfirmPassword
                                    ? t('auth.password.hide')
                                    : t('auth.password.show')
                            }
                            onClick={() =>
                                setShowConfirmPassword((current) => !current)
                            }
                        >
                            •••
                        </button>
                    </div>

                    {errors.confirmPassword && (
                        <p className={styles.error}>{errors.confirmPassword}</p>
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
                        ? t('auth.register.loading')
                        : t('auth.register.submit')}
                </button>
            </form>

            <div className={styles.footer}>
                <span>{t('auth.register.hasAccount')}</span>

                <Link
                    to="/account/login"
                    state={{ from: redirectPath }}
                    className={styles.link}
                >
                    {t('auth.register.login')}
                </Link>
            </div>
        </div>
    );
};
