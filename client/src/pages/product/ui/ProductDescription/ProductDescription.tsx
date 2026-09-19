import { useTranslation } from 'react-i18next';

import styles from './ProductDescription.module.scss';

type ProductDescriptionProps = {
    description: string | null;
};

export const ProductDescription = ({
    description,
}: ProductDescriptionProps) => {
    const { t } = useTranslation();

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <p className={styles.eyebrow}>{t('product.overview')}</p>

                <h2 className={styles.title}>{t('product.aboutProduct')}</h2>
            </div>

            <div className={styles.card}>
                {description ? (
                    <p>{description}</p>
                ) : (
                    <p className={styles.muted}>{t('product.noDescription')}</p>
                )}
            </div>
        </section>
    );
};
