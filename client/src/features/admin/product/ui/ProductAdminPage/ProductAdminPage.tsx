import { useTranslation } from 'react-i18next';

import { useAdminProduct } from '../../model';

import { ProductBasicInfo } from '../ProductBasicInfo/ProductBasicInfo';
import { ProductImages } from '../ProductImages/ProductImages';
import { ProductPrices } from '../ProductPrices/ProductPrices';
import { ProductTranslations } from '../ProductTranslations/ProductTranslations';
import { ProductVariants } from '../ProductVariants/ProductVariants';

import styles from './ProductAdminPage.module.scss';

export const ProductAdminPage = () => {
    const { t } = useTranslation();

    const { data: product, isLoading, isError, error } = useAdminProduct();

    if (isLoading) {
        return (
            <section className={styles.page}>
                <div className={styles.state}>{t('common.loading')}</div>
            </section>
        );
    }

    if (isError || !product) {
        return (
            <section className={styles.page}>
                <div className={styles.state}>
                    {error instanceof Error ? error.message : t('common.error')}
                </div>
            </section>
        );
    }

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>
                        {t('admin.products.title')}
                    </p>

                    <h1 className={styles.title}>{product.name}</h1>

                    <p className={styles.slug}>/{product.slug}</p>
                </div>

                <span
                    className={`${styles.status} ${
                        styles[`status${product.status}`]
                    }`}
                >
                    {t(`admin.products.status.${product.status.toLowerCase()}`)}
                </span>
            </header>

            <div className={styles.grid}>
                <ProductBasicInfo product={product} />

                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>
                        {t('admin.products.currentPrice')}
                    </h2>

                    <div className={styles.price}>{product.price}</div>

                    <span className={styles.currency}>{product.currency}</span>
                </section>

                <ProductTranslations productId={product.id} />

                <ProductPrices productId={product.id} />

                <ProductVariants productId={product.id} />

                <ProductImages productId={product.id} />
            </div>
        </section>
    );
};
