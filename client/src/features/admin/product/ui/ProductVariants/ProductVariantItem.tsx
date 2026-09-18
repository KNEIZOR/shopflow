import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ProductVariant } from '@/entities/product';
import { CURRENCIES, type CurrencyCode } from '@/shared/config/currencies';

import { ProductVariantAttributes } from './ProductVariantAttributes/ProductVariantAttributes';
import { ProductVariantForm } from './ProductVariantForm';
import { ProductVariantPrices } from './ProductVariantPrices/ProductVariantPrices';

import styles from './ProductVariants.module.scss';

type ProductVariantItemProps = {
    productId: string;
    productTypeId: string | null;
    variant: ProductVariant;
    isDeleting: boolean;
    onDelete: () => Promise<void>;
};

const getCurrencySymbol = (currency: CurrencyCode): string => {
    return (
        CURRENCIES.find((item) => item.code === currency)?.symbol ?? currency
    );
};

export const ProductVariantItem = ({
    productId,
    productTypeId,
    variant,
    isDeleting,
    onDelete,
}: ProductVariantItemProps) => {
    const { t } = useTranslation();

    const [isEditing, setIsEditing] = useState(false);
    const [isPricesOpen, setIsPricesOpen] = useState(false);
    const [isAttributesOpen, setIsAttributesOpen] = useState(false);

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
                            {variant.price}{' '}
                            {getCurrencySymbol(variant.currency)}
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

                <div className={styles.expandActions}>
                    <button
                        type="button"
                        className={`${styles.expandButton} ${
                            isPricesOpen ? styles.expandButtonActive : ''
                        }`}
                        aria-expanded={isPricesOpen}
                        onClick={() => setIsPricesOpen((current) => !current)}
                    >
                        <span>{t('admin.products.variantPrices')}</span>

                        <span
                            className={`${styles.expandIcon} ${
                                isPricesOpen ? styles.expandIconOpen : ''
                            }`}
                            aria-hidden="true"
                        >
                            ›
                        </span>
                    </button>

                    {productTypeId && (
                        <button
                            type="button"
                            className={`${styles.expandButton} ${
                                isAttributesOpen
                                    ? styles.expandButtonActive
                                    : ''
                            }`}
                            aria-expanded={isAttributesOpen}
                            onClick={() =>
                                setIsAttributesOpen((current) => !current)
                            }
                        >
                            <span>{t('admin.products.variantAttributes')}</span>

                            <span
                                className={`${styles.expandIcon} ${
                                    isAttributesOpen
                                        ? styles.expandIconOpen
                                        : ''
                                }`}
                                aria-hidden="true"
                            >
                                ›
                            </span>
                        </button>
                    )}
                </div>

                {isPricesOpen && (
                    <div className={styles.expandableSection}>
                        <ProductVariantPrices
                            productId={productId}
                            variantId={variant.id}
                        />
                    </div>
                )}

                {isAttributesOpen && productTypeId && (
                    <div className={styles.expandableSection}>
                        <ProductVariantAttributes
                            productId={productId}
                            variantId={variant.id}
                            productTypeId={productTypeId}
                        />
                    </div>
                )}
            </div>
        </article>
    );
};
