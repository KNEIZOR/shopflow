import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { Product } from '@/entities/product';

import { ProductBasicInfoForm } from './ProductBasicInfoForm';

import styles from './ProductBasicInfo.module.scss';

type ProductBasicInfoProps = {
    product: Product;
};

const getStatusTranslationKey = (status: Product['status']) => {
    return `admin.products.status.${status.toLowerCase()}`;
};

export const ProductBasicInfo = ({ product }: ProductBasicInfoProps) => {
    const { t } = useTranslation();

    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <section className={styles.card}>
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>
                            {t('admin.products.basicInfo')}
                        </h2>

                        <p className={styles.description}>
                            {t('admin.products.basicInfoDescription')}
                        </p>
                    </div>
                </div>

                <ProductBasicInfoForm
                    product={product}
                    onClose={() => setIsEditing(false)}
                />
            </section>
        );
    }

    return (
        <section className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>
                        {t('admin.products.basicInfo')}
                    </h2>

                    <p className={styles.description}>
                        {t('admin.products.basicInfoDescription')}
                    </p>
                </div>

                <button
                    type="button"
                    className={styles.editButton}
                    onClick={() => setIsEditing(true)}
                >
                    {t('common.edit')}
                </button>
            </div>

            <div className={styles.infoList}>
                <div className={styles.infoRow}>
                    <span>{t('admin.products.name')}</span>

                    <strong>{product.name}</strong>
                </div>

                <div className={styles.infoRow}>
                    <span>{t('admin.products.slug')}</span>

                    <strong>{product.slug}</strong>
                </div>

                <div className={styles.infoRow}>
                    <span>{t('admin.products.category')}</span>

                    <strong>{product.category.name}</strong>
                </div>

                <div className={styles.infoRow}>
                    <span>{t('admin.products.status.label')}</span>

                    <span
                        className={`${styles.status} ${
                            styles[`status${product.status}`]
                        }`}
                    >
                        {t(getStatusTranslationKey(product.status))}
                    </span>
                </div>
            </div>

            {product.description && (
                <div className={styles.descriptionBlock}>
                    <span>{t('admin.products.description')}</span>

                    <p>{product.description}</p>
                </div>
            )}
        </section>
    );
};
