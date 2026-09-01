import { useTranslation } from 'react-i18next';

import styles from './Footer.module.scss';

export const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footer__inner}`}>
                <p className={styles.footer__copyright}>
                    © {new Date().getFullYear()} ShopFlow
                </p>

                <p className={styles.footer__text}>{t('footer.description')}</p>
            </div>
        </footer>
    );
};
