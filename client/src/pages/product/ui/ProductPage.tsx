import { useTranslation } from 'react-i18next';

import { useProduct } from '../model/useProduct';

import { formatCurrency } from '@/shared/lib/formatCurrency';

import styles from './ProductPage.module.scss';

export const ProductPage = () => {
    const { t } = useTranslation();

    const { data: product, isLoading, isError } = useProduct();

    if (isLoading) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <p>{t('catalog.loading')}</p>
                </div>
            </main>
        );
    }

    if (isError || !product) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <p>{t('catalog.error')}</p>
                </div>
            </main>
        );
    }

    const image = product.images[0];

    return (
        <main className={styles.page}>
            <div className="container">
                <div className={styles.product}>
                    <div className={styles.imageWrapper}>
                        {image ? (
                            <img
                                src={image.url}
                                alt={image.alt ?? product.name}
                                className={styles.image}
                            />
                        ) : (
                            <div className={styles.placeholder}>
                                {t('product.noImage')}
                            </div>
                        )}
                    </div>

                    <div className={styles.content}>
                        <p className={styles.category}>
                            {product.category.name}
                        </p>

                        <h1 className={styles.title}>{product.name}</h1>

                        {product.description && (
                            <p className={styles.description}>
                                {product.description}
                            </p>
                        )}

                        <p className={styles.price}>
                            {formatCurrency(product.price, product.currency)}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};
