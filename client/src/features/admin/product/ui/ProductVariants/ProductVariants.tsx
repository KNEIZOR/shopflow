import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDeleteProductVariant, useProductVariants } from '../../model';

import { ProductVariantForm } from './ProductVariantForm';
import { ProductVariantItem } from './ProductVariantItem';

import styles from './ProductVariants.module.scss';

type ProductVariantsProps = {
    productId: string;
};

export const ProductVariants = ({ productId }: ProductVariantsProps) => {
    const { t } = useTranslation();

    const { data, isLoading, isError } = useProductVariants(productId);

    const deleteVariant = useDeleteProductVariant();

    const [isCreating, setIsCreating] = useState(false);

    if (isLoading) {
        return (
            <section className={styles.card}>
                <h2 className={styles.title}>{t('admin.products.variants')}</h2>

                <p className={styles.muted}>{t('common.loading')}</p>
            </section>
        );
    }

    if (isError || !data) {
        return (
            <section className={styles.card}>
                <h2 className={styles.title}>{t('admin.products.variants')}</h2>

                <p className={styles.error}>{t('common.error')}</p>
            </section>
        );
    }

    const handleDelete = async (variantId: string) => {
        await deleteVariant.mutateAsync({
            productId,
            variantId,
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
                        {t('admin.products.variants')}
                    </h2>

                    <p className={styles.description}>
                        {t('admin.products.variantsDescription')}
                    </p>
                </div>

                {!isCreating && (
                    <button
                        type="button"
                        className={styles.addButton}
                        onClick={() => setIsCreating(true)}
                    >
                        {t('admin.products.addVariant')}
                    </button>
                )}
            </div>

            {isCreating && (
                <div className={styles.createSection}>
                    <ProductVariantForm
                        productId={productId}
                        onClose={handleCreateClose}
                    />
                </div>
            )}

            {data.items.length === 0 && !isCreating ? (
                <div className={styles.empty}>
                    <p>{t('admin.products.noVariants')}</p>
                </div>
            ) : (
                data.items.length > 0 && (
                    <div className={styles.list}>
                        {data.items.map((variant) => (
                            <ProductVariantItem
                                key={variant.id}
                                productId={productId}
                                variant={variant}
                                isDeleting={deleteVariant.isPending}
                                onDelete={() => handleDelete(variant.id)}
                            />
                        ))}
                    </div>
                )
            )}
        </section>
    );
};
