import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDeleteProductImage, useProductImages } from '../../model';

import { ProductImageForm } from './ProductImageForm';
import { ProductImageItem } from './ProductImageItem';

import styles from './ProductImages.module.scss';

type ProductImagesProps = {
    productId: string;
};

const MAX_IMAGES = 20;

export const ProductImages = ({ productId }: ProductImagesProps) => {
    const { t } = useTranslation();

    const { data, isLoading, isError } = useProductImages(productId);

    const deleteImage = useDeleteProductImage();

    const [isCreating, setIsCreating] = useState(false);

    if (isLoading) {
        return (
            <section className={styles.card}>
                <h2 className={styles.title}>{t('admin.products.images')}</h2>

                <p className={styles.muted}>{t('common.loading')}</p>
            </section>
        );
    }

    if (isError || !data) {
        return (
            <section className={styles.card}>
                <h2 className={styles.title}>{t('admin.products.images')}</h2>

                <p className={styles.error}>{t('common.error')}</p>
            </section>
        );
    }

    const images = data.items;
    const hasReachedLimit = images.length >= MAX_IMAGES;

    const handleDelete = async (imageId: string) => {
        await deleteImage.mutateAsync({
            productId,
            imageId,
        });
    };

    const handleCreateClose = () => {
        setIsCreating(false);
    };

    return (
        <section className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>
                        {t('admin.products.images')}
                    </h2>

                    <p className={styles.description}>
                        {t('admin.products.imagesDescription')}
                    </p>
                </div>

                {!isCreating && !hasReachedLimit && (
                    <button
                        type="button"
                        className={styles.addButton}
                        disabled={deleteImage.isPending}
                        onClick={() => setIsCreating(true)}
                    >
                        {t('admin.products.addImage')}
                    </button>
                )}
            </div>

            {hasReachedLimit && (
                <p className={styles.limitMessage}>
                    {t('admin.products.imageLimit')}
                </p>
            )}

            {isCreating && (
                <div className={styles.createSection}>
                    <ProductImageForm
                        productId={productId}
                        nextPosition={images.length}
                        onClose={handleCreateClose}
                    />
                </div>
            )}

            {images.length === 0 && !isCreating ? (
                <div className={styles.empty}>
                    <p>{t('admin.products.noImages')}</p>
                </div>
            ) : (
                images.length > 0 && (
                    <div className={styles.list}>
                        {images.map((image) => (
                            <ProductImageItem
                                key={image.id}
                                productId={productId}
                                image={image}
                                isDeleting={deleteImage.isPending}
                                onDelete={() => handleDelete(image.id)}
                            />
                        ))}
                    </div>
                )
            )}
        </section>
    );
};
