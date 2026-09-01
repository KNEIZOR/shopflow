import { useTranslation } from 'react-i18next';

import styles from './HomePage.module.scss';

export const HomePage = () => {
    const { t } = useTranslation();

    return (
        <section className={styles.homePage}>
            <div className="container">
                <div className={styles.hero}>
                    <p className={styles.eyebrow}>{t('home.eyebrow')}</p>

                    <h1 className={styles.title}>{t('home.title')}</h1>

                    <p className={styles.description}>
                        {t('home.description')}
                    </p>
                </div>
            </div>
        </section>
    );
};
