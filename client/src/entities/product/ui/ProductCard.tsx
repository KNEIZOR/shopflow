import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import type { Product } from '../model/types';

import styles from './ProductCard.module.scss';

type ProductCardProps = {
    product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
    const { t } = useTranslation();
    const image = product.images[0];

    return (
        <article className={styles.card}>
            <Link to={`/product/${product.slug}`} className={styles.imageLink}>
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
            </Link>

            <div className={styles.content}>
                <Link
                    to={`/product/${product.slug}`}
                    className={styles.category}
                >
                    {product.category.name}
                </Link>

                <Link to={`/product/${product.slug}`} className={styles.name}>
                    {product.name}
                </Link>

                <span className={styles.price}>{product.price}</span>
            </div>
        </article>
    );
};
