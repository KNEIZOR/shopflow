import { useTranslation } from 'react-i18next';

import type { ToastOptions } from './toast-context';

import styles from './Toast.module.scss';

type ToastProps = ToastOptions & {
    onClose: () => void;
};

export const Toast = ({ type, message, onClose }: ToastProps) => {
    const { t } = useTranslation();

    return (
        <div
            className={`${styles.toast} ${styles[type]}`}
            role={type === 'error' ? 'alert' : 'status'}
        >
            <div className={styles.content}>
                <span className={styles.icon} aria-hidden="true">
                    {type === 'success' && '✓'}
                    {type === 'error' && '!'}
                    {type === 'info' && 'i'}
                </span>

                <span className={styles.message}>{message}</span>
            </div>

            <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label={t('common.close')}
            >
                ×
            </button>
        </div>
    );
};
