import { useTranslation } from 'react-i18next';

import type { ProductImage } from '@/entities/product';

import styles from './ProductGallery.module.scss';

type ProductGalleryProps = {
    productName: string;
    images: ProductImage[];
    activeImageIndex: number;
    onImageChange: (index: number) => void;
};

export const ProductGallery = ({
    productName,
    images,
    activeImageIndex,
    onImageChange,
}: ProductGalleryProps) => {
    const { t } = useTranslation();

    const activeImage = images[activeImageIndex];

    return (
        <div className={styles.gallery}>
            <div className={styles.mainImage}>
                {activeImage ? (
                    <img
                        src={activeImage.url}
                        alt={activeImage.alt ?? productName}
                        className={styles.image}
                    />
                ) : (
                    <div className={styles.placeholder}>
                        {t('product.noImage')}
                    </div>
                )}
            </div>

            {images.length > 1 && (
                <div
                    className={styles.thumbnails}
                    aria-label={t('product.gallery')}
                >
                    {images.map((image, index) => {
                        const isActive = index === activeImageIndex;

                        return (
                            <button
                                key={image.id}
                                type="button"
                                className={`${styles.thumbnail} ${
                                    isActive ? styles.thumbnailActive : ''
                                }`}
                                onClick={() => onImageChange(index)}
                                aria-label={t('product.imageNumber', {
                                    number: index + 1,
                                })}
                                aria-pressed={isActive}
                            >
                                <img
                                    src={image.url}
                                    alt={image.alt ?? productName}
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
