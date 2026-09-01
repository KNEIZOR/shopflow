import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <section className={styles.notFoundPage}>
            <div className="container">
                <div className={styles.content}>
                    <p className={styles.code}>404</p>

                    <h1 className={styles.title}>{t('notFound.title')}</h1>

                    <p className={styles.description}>
                        {t('notFound.description')}
                    </p>

                    <Link to="/" className={styles.link}>
                        {t('notFound.backHome')}
                    </Link>
                </div>
            </div>
        </section>
    );
};
