import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ProductImage } from '@/entities/product';

import { ProductImageForm } from './ProductImageForm';

import styles from './ProductImages.module.scss';

type ProductImageItemProps = {
    productId: string;
    image: ProductImage;
    isDeleting: boolean;
    onDelete: () => Promise<void>;
};

export const ProductImageItem = ({
    productId,
    image,
    isDeleting,
    onDelete,
}: ProductImageItemProps) => {
    const { t } = useTranslation();

    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <ProductImageForm
                productId={productId}
                image={image}
                onClose={() => setIsEditing(false)}
            />
        );
    }

    return (
        <article className={styles.imageItem}>
            <div className={styles.previewWrapper}>
                <img
                    src={image.url}
                    alt={image.alt ?? ''}
                    className={styles.preview}
                />
            </div>

            <div className={styles.imageInfo}>
                <div className={styles.imageHeader}>
                    <strong>
                        {t('admin.products.imagePosition')}: {image.position}
                    </strong>
                </div>

                <p className={styles.imageUrl}>{image.url}</p>

                {image.alt && <p className={styles.imageAlt}>{image.alt}</p>}
            </div>

            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.editButton}
                    disabled={isDeleting}
                    onClick={() => setIsEditing(true)}
                >
                    {t('common.edit')}
                </button>

                <button
                    type="button"
                    className={styles.deleteButton}
                    disabled={isDeleting}
                    onClick={onDelete}
                >
                    {t('common.delete')}
                </button>
            </div>
        </article>
    );
};
