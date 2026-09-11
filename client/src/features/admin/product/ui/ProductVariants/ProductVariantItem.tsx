import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ProductVariant } from '@/entities/product';

import { ProductVariantForm } from './ProductVariantForm';
import { ProductVariantPrices } from './ProductVariantPrices/ProductVariantPrices';

import styles from './ProductVariants.module.scss';

type ProductVariantItemProps = {
    productId: string;
    variant: ProductVariant;
    isDeleting: boolean;
    onDelete: () => Promise<void>;
};

export const ProductVariantItem = ({
    productId,
    variant,
    isDeleting,
    onDelete,
}: ProductVariantItemProps) => {
    const { t } = useTranslation();

    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <ProductVariantForm
                productId={productId}
                variant={variant}
                onClose={() => setIsEditing(false)}
            />
        );
    }

    return (
        <article className={styles.variant}>
            <div className={styles.variantContent}>
                <div className={styles.variantInfo}>
                    <div className={styles.variantMain}>
                        <h3 className={styles.variantName}>
                            {variant.name || t('admin.products.unnamedVariant')}
                        </h3>

                        <span className={styles.sku}>
                            {t('admin.products.sku')}: {variant.sku}
                        </span>
                    </div>

                    <div className={styles.stock}>
                        <span>{t('admin.products.stock')}</span>

                        <strong>{variant.stock}</strong>
                    </div>

                    {variant.price !== null && (
                        <div className={styles.variantPrice}>
                            {variant.price} {variant.currency}
                        </div>
                    )}
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

                <ProductVariantPrices
                    productId={productId}
                    variantId={variant.id}
                />
            </div>
        </article>
    );
};
