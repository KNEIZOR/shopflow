import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import type { Product } from '../model/types';

import {
    createResponsiveImageSources,
    optimizeImageUrl,
} from '@/shared/lib/optimizeImageUrl';
import { formatCurrency } from '@/shared/lib/formatCurrency';

import styles from './ProductCard.module.scss';

type ProductCardProps = {
    product: Product;
    priority?: boolean;
};

const PRODUCT_IMAGE_WIDTHS = [160, 240, 320, 400, 480];

const PRIORITY_IMAGE_QUALITY = 66;
const DEFAULT_IMAGE_QUALITY = 62;

const PRODUCT_IMAGE_SIZES =
    '(max-width: 480px) calc((100vw - 34px) / 2), ' +
    '(max-width: 768px) calc((100vw - 54px) / 2), ' +
    '(max-width: 1100px) calc((100vw - 76px) / 3), ' +
    'calc((min(100vw, 1280px) - 100px) / 4)';

export const ProductCard = ({
    product,
    priority = false,
}: ProductCardProps) => {
    const { t } = useTranslation();

    const image = product.images[0];

    const imageQuality = priority
        ? PRIORITY_IMAGE_QUALITY
        : DEFAULT_IMAGE_QUALITY;

    const optimizedImage = image
        ? optimizeImageUrl(image.url, {
              width: priority ? 480 : 320,
              quality: imageQuality,
          })
        : null;

    const imageSrcSet = image
        ? createResponsiveImageSources(
              image.url,
              PRODUCT_IMAGE_WIDTHS,
              imageQuality,
          )
        : undefined;

    return (
        <article className={styles.card}>
            <Link
                to={`/product/${product.slug}`}
                className={styles.imageLink}
                aria-label={product.name}
            >
                <div className={styles.imageWrapper}>
                    {optimizedImage ? (
                        <img
                            src={optimizedImage}
                            srcSet={imageSrcSet}
                            sizes={PRODUCT_IMAGE_SIZES}
                            alt={image.alt ?? product.name}
                            className={styles.image}
                            loading={priority ? 'eager' : 'lazy'}
                            fetchPriority={priority ? 'high' : 'auto'}
                            decoding="async"
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

                <span className={styles.price}>
                    {formatCurrency(product.price, product.currency)}
                </span>
            </div>
        </article>
    );
};
