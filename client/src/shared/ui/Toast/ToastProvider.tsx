import { type ReactNode, useCallback, useMemo, useState } from 'react';

import { Toast } from './Toast';
import { ToastContext, type ToastOptions } from './toast-context';

import styles from './Toast.module.scss';

type ToastItem = ToastOptions & {
    id: number;
};

type ToastProviderProps = {
    children: ReactNode;
};

const DEFAULT_DURATION = 4000;

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(
        ({ type, message, duration = DEFAULT_DURATION }: ToastOptions) => {
            const id = Date.now() + Math.random();

            setToasts((current) => [
                ...current,
                {
                    id,
                    type,
                    message,
                    duration,
                },
            ]);

            if (duration > 0) {
                window.setTimeout(() => {
                    removeToast(id);
                }, duration);
            }
        },
        [removeToast],
    );

    const contextValue = useMemo(
        () => ({
            showToast,
        }),
        [showToast],
    );

    return (
        <ToastContext.Provider value={contextValue}>
            {children}

            <div className={styles.container}>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        type={toast.type}
                        message={toast.message}
                        duration={toast.duration}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
