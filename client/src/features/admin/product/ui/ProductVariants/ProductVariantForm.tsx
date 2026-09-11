import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateProductVariant, useUpdateProductVariant } from '../../model';

import type { ProductVariant } from '@/entities/product';

import styles from './ProductVariants.module.scss';

type ProductVariantFormProps = {
    productId: string;
    variant?: ProductVariant;
    onClose: () => void;
};

export const ProductVariantForm = ({
    productId,
    variant,
    onClose,
}: ProductVariantFormProps) => {
    const { t } = useTranslation();

    const createVariant = useCreateProductVariant();

    const updateVariant = useUpdateProductVariant();

    const [name, setName] = useState(variant?.name ?? '');

    const [sku, setSku] = useState(variant?.sku ?? '');

    const [stock, setStock] = useState(String(variant?.stock ?? 0));

    const [price, setPrice] = useState(variant?.price ?? '');

    const isSaving = createVariant.isPending || updateVariant.isPending;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedName = name.trim();
        const trimmedSku = sku.trim();

        if (!trimmedName || !trimmedSku) {
            return;
        }

        const parsedStock = Number(stock);

        if (!Number.isInteger(parsedStock) || parsedStock < 0) {
            return;
        }

        const parsedPrice = price.trim() === '' ? undefined : Number(price);

        if (
            parsedPrice !== undefined &&
            (!Number.isFinite(parsedPrice) || parsedPrice < 0)
        ) {
            return;
        }

        if (variant) {
            await updateVariant.mutateAsync({
                productId,
                variantId: variant.id,
                input: {
                    name: trimmedName,
                    sku: trimmedSku,
                    stock: parsedStock,
                    price: parsedPrice ?? null,
                },
            });

            onClose();

            return;
        }

        await createVariant.mutateAsync({
            productId,
            input: {
                name: trimmedName,
                sku: trimmedSku,
                stock: parsedStock,
                ...(parsedPrice !== undefined && {
                    price: parsedPrice,
                }),
            },
        });

        onClose();
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
                <label className={styles.field}>
                    <span>{t('admin.products.variantName')}</span>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        disabled={isSaving}
                        autoComplete="off"
                    />
                </label>

                <label className={styles.field}>
                    <span>{t('admin.products.sku')}</span>

                    <input
                        type="text"
                        value={sku}
                        onChange={(event) => setSku(event.target.value)}
                        disabled={isSaving}
                        autoComplete="off"
                    />
                </label>

                <label className={styles.field}>
                    <span>{t('admin.products.stock')}</span>

                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={stock}
                        onChange={(event) => setStock(event.target.value)}
                        disabled={isSaving}
                    />
                </label>

                <label className={styles.field}>
                    <span>{t('admin.products.variantPrice')}</span>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        disabled={isSaving}
                    />
                </label>
            </div>

            <div className={styles.formActions}>
                <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={isSaving || !name.trim() || !sku.trim()}
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
