import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ProductVariant } from '@/entities/product';
import { useToast } from '@/shared/ui/Toast';

import { useCreateProductVariant, useUpdateProductVariant } from '../../model';

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
    const { showToast } = useToast();

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
        const trimmedStock = stock.trim();
        const trimmedPrice = price.trim();

        if (!trimmedName || !trimmedSku || !trimmedStock) {
            return;
        }

        const parsedStock = Number(trimmedStock);

        if (!Number.isInteger(parsedStock) || parsedStock < 0) {
            return;
        }

        const parsedPrice =
            trimmedPrice === '' ? undefined : Number(trimmedPrice);

        if (
            parsedPrice !== undefined &&
            (!Number.isFinite(parsedPrice) || parsedPrice < 0)
        ) {
            return;
        }

        try {
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

                showToast({
                    type: 'success',
                    message: t('admin.products.variantUpdated'),
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

            showToast({
                type: 'success',
                message: t('admin.products.variantCreated'),
            });

            onClose();
        } catch (error) {
            showToast({
                type: 'error',
                message:
                    error instanceof Error ? error.message : t('common.error'),
            });
        }
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
                        autoComplete="off"
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
                        autoComplete="off"
                    />
                </label>
            </div>

            <div className={styles.formActions}>
                <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={
                        isSaving || !name.trim() || !sku.trim() || !stock.trim()
                    }
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
