import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import styles from './CatalogCtaSection.module.scss';

const DECORATIVE_RINGS = [
    {
        id: 'outer',
        className: 'outer',
    },
    {
        id: 'middle',
        className: 'middle',
    },
    {
        id: 'inner',
        className: 'inner',
    },
] as const;

const DECORATIVE_DOTS = [
    {
        id: 'one',
        className: 'one',
    },
    {
        id: 'two',
        className: 'two',
    },
    {
        id: 'three',
        className: 'three',
    },
] as const;

export const CatalogCtaSection = () => {
    const { t } = useTranslation();

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.card}>
                    <div className={styles.background} aria-hidden="true">
                        <div className={styles.glow} />

                        <div className={styles.decor}>
                            {DECORATIVE_RINGS.map((ring) => (
                                <span
                                    key={ring.id}
                                    className={`${styles.ring} ${styles[ring.className]}`}
                                />
                            ))}
                        </div>

                        <div className={styles.dots}>
                            {DECORATIVE_DOTS.map((dot) => (
                                <span
                                    key={dot.id}
                                    className={`${styles.dot} ${styles[dot.className]}`}
                                />
                            ))}
                        </div>

                        <span className={styles.gridLineHorizontal} />
                        <span className={styles.gridLineVertical} />
                    </div>

                    <div className={styles.content}>
                        <p className={styles.eyebrow}>
                            <span
                                className={styles.eyebrowLine}
                                aria-hidden="true"
                            />

                            {t('home.cta.eyebrow')}
                        </p>

                        <h2 className={styles.title}>{t('home.cta.title')}</h2>

                        <p className={styles.description}>
                            {t('home.cta.description')}
                        </p>

                        <Link to="/catalog" className={styles.button}>
                            <span>{t('home.cta.button')}</span>

                            <span className={styles.arrow} aria-hidden="true">
                                →
                            </span>
                        </Link>
                    </div>

                    <div className={styles.corner} aria-hidden="true" />
                </div>
            </div>
        </section>
    );
};
