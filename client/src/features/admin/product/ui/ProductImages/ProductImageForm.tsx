import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAddProductImage, useUpdateProductImage } from '../../model';

import type { ProductImage } from '@/entities/product';

import styles from './ProductImages.module.scss';

type ProductImageFormProps = {
    productId: string;
    image?: ProductImage;
    nextPosition?: number;
    onClose: () => void;
};

export const ProductImageForm = ({
    productId,
    image,
    nextPosition = 0,
    onClose,
}: ProductImageFormProps) => {
    const { t } = useTranslation();

    const addImage = useAddProductImage();
    const updateImage = useUpdateProductImage();

    const [url, setUrl] = useState(image?.url ?? '');

    const [alt, setAlt] = useState(image?.alt ?? '');

    const [position, setPosition] = useState(
        String(image?.position ?? nextPosition),
    );

    const isSaving = addImage.isPending || updateImage.isPending;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedUrl = url.trim();
        const trimmedAlt = alt.trim();

        if (!trimmedUrl) {
            return;
        }

        const parsedPosition = Number(position);

        if (!Number.isInteger(parsedPosition) || parsedPosition < 0) {
            return;
        }

        if (image) {
            await updateImage.mutateAsync({
                productId,
                imageId: image.id,
                input: {
                    url: trimmedUrl,
                    alt: trimmedAlt || null,
                    position: parsedPosition,
                },
            });

            onClose();

            return;
        }

        await addImage.mutateAsync({
            productId,
            input: {
                url: trimmedUrl,
                alt: trimmedAlt || undefined,
                position: parsedPosition,
            },
        });

        onClose();
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
                <label className={styles.field}>
                    <span>{t('admin.products.imageUrl')}</span>

                    <input
                        type="url"
                        value={url}
                        onChange={(event) => setUrl(event.target.value)}
                        placeholder="https://..."
                        disabled={isSaving}
                        autoComplete="off"
                    />
                </label>

                <label className={styles.field}>
                    <span>{t('admin.products.imageAlt')}</span>

                    <input
                        type="text"
                        value={alt}
                        onChange={(event) => setAlt(event.target.value)}
                        placeholder={t('admin.products.imageAltPlaceholder')}
                        disabled={isSaving}
                        autoComplete="off"
                    />
                </label>

                <label className={styles.field}>
                    <span>{t('admin.products.imagePosition')}</span>

                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={position}
                        onChange={(event) => setPosition(event.target.value)}
                        disabled={isSaving}
                    />
                </label>
            </div>

            <div className={styles.formActions}>
                <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={isSaving || !url.trim()}
                >
                    {isSaving ? t('common.saving') : t('common.save')}
                </button>

                <button
                    type="button"
                    className={styles.cancelButton}
                    disabled={isSaving}
                    onClick={onClose}
                >
                    {t('common.cancel')}
                </button>
            </div>
        </form>
    );
};
