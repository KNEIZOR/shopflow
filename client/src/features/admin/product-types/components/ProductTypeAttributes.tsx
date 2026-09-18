import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    useDeleteProductTypeAttribute,
    useProductTypeAttributes,
} from '@/features/admin/product/model';

import type { ProductTypeAttribute } from '@/entities/product-type';

import { ProductTypeAttributeForm } from './ProductTypeAttributeForm';
import { ProductTypeAttributeOptions } from './ProductTypeAttributeOptions';

import styles from './ProductTypeAttributes.module.scss';

type ProductTypeAttributesProps = {
    productTypeId: string;
};

export const ProductTypeAttributes = ({
    productTypeId,
}: ProductTypeAttributesProps) => {
    const { t } = useTranslation();

    const {
        data: attributes = [],
        isLoading,
        isError,
        refetch,
    } = useProductTypeAttributes(productTypeId);

    const deleteAttribute = useDeleteProductTypeAttribute();

    const [isCreating, setIsCreating] = useState(false);
    const [editingAttributeId, setEditingAttributeId] = useState<string | null>(
        null,
    );
    const [error, setError] = useState<string | null>(null);

    const formRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isCreating && !editingAttributeId) {
            return;
        }

        const frameId = window.requestAnimationFrame(() => {
            formRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        });

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [isCreating, editingAttributeId]);

    const handleCreate = (): void => {
        setError(null);
        setEditingAttributeId(null);
        setIsCreating(true);
    };

    const handleEdit = (attribute: ProductTypeAttribute): void => {
        setError(null);
        setIsCreating(false);
        setEditingAttributeId(attribute.id);
    };

    const handleCloseForm = (): void => {
        setIsCreating(false);
        setEditingAttributeId(null);
        setError(null);
    };

    const handleDelete = async (
        attribute: ProductTypeAttribute,
    ): Promise<void> => {
        const confirmed = window.confirm(
            t('admin.productTypes.attributes.deleteConfirm', {
                name: attribute.name,
            }),
        );

        if (!confirmed) {
            return;
        }

        setError(null);

        try {
            await deleteAttribute.mutateAsync({
                productTypeId,
                attributeId: attribute.id,
            });

            if (editingAttributeId === attribute.id) {
                handleCloseForm();
            }
        } catch {
            setError(t('admin.productTypes.attributes.errors.delete'));
        }
    };

    const getTypeLabel = (type: ProductTypeAttribute['type']): string => {
        return t(`admin.productTypes.attributes.types.${type}`);
    };

    const getScopeLabel = (scope: ProductTypeAttribute['scope']): string => {
        return t(`admin.productTypes.attributes.scopes.${scope}`);
    };

    return (
        <section className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>
                        {t('admin.productTypes.attributes.title')}
                    </h3>

                    <p className={styles.description}>
                        {t('admin.productTypes.attributes.description')}
                    </p>
                </div>

                {!isCreating && !editingAttributeId && (
                    <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={handleCreate}
                    >
                        {t('admin.productTypes.attributes.create')}
                    </button>
                )}
            </div>

            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}

            {(isCreating || editingAttributeId) && (
                <div ref={formRef} style={{ scrollMarginTop: '24px' }}>
                    {isCreating && (
                        <ProductTypeAttributeForm
                            productTypeId={productTypeId}
                            onClose={handleCloseForm}
                        />
                    )}

                    {editingAttributeId && (
                        <ProductTypeAttributeForm
                            productTypeId={productTypeId}
                            attributeId={editingAttributeId}
                            attribute={attributes.find(
                                (item) => item.id === editingAttributeId,
                            )}
                            onClose={handleCloseForm}
                        />
                    )}
                </div>
            )}

            {isLoading && (
                <div className={styles.state}>{t('common.loading')}</div>
            )}

            {isError && !isLoading && (
                <div className={styles.state}>
                    <p>{t('admin.productTypes.attributes.errors.load')}</p>

                    <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={() => void refetch()}
                    >
                        {t('admin.productTypes.attributes.retry')}
                    </button>
                </div>
            )}

            {!isLoading && !isError && attributes.length === 0 && (
                <div className={styles.empty}>
                    <h4>{t('admin.productTypes.attributes.emptyTitle')}</h4>

                    <p>{t('admin.productTypes.attributes.emptyDescription')}</p>
                </div>
            )}

            {!isLoading && !isError && attributes.length > 0 && (
                <div className={styles.list}>
                    {attributes.map((attribute) => {
                        const isEditing = editingAttributeId === attribute.id;

                        return (
                            <article
                                key={attribute.id}
                                className={`${styles.item} ${
                                    isEditing ? styles.itemEditing : ''
                                }`}
                            >
                                <div className={styles.itemMain}>
                                    <div className={styles.itemInfo}>
                                        <div className={styles.itemTitleRow}>
                                            <h4 className={styles.itemTitle}>
                                                {attribute.name}
                                            </h4>

                                            {attribute.isRequired && (
                                                <span
                                                    className={
                                                        styles.requiredBadge
                                                    }
                                                >
                                                    {t(
                                                        'admin.productTypes.attributes.required',
                                                    )}
                                                </span>
                                            )}
                                        </div>

                                        <p className={styles.slug}>
                                            {attribute.slug}
                                        </p>

                                        {attribute.description && (
                                            <p
                                                className={
                                                    styles.itemDescription
                                                }
                                            >
                                                {attribute.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className={styles.meta}>
                                        <span className={styles.badge}>
                                            {getTypeLabel(attribute.type)}
                                        </span>

                                        <span className={styles.badge}>
                                            {getScopeLabel(attribute.scope)}
                                        </span>

                                        <span className={styles.position}>
                                            #{attribute.position}
                                        </span>
                                    </div>
                                </div>

                                {attribute.type === 'SELECT' && (
                                    <ProductTypeAttributeOptions
                                        productTypeId={productTypeId}
                                        attributeId={attribute.id}
                                        optionCount={
                                            attribute.options?.length ?? 0
                                        }
                                    />
                                )}

                                <div className={styles.actions}>
                                    <button
                                        type="button"
                                        className={styles.secondaryButton}
                                        onClick={() => handleEdit(attribute)}
                                        disabled={deleteAttribute.isPending}
                                    >
                                        {t('common.edit')}
                                    </button>

                                    <button
                                        type="button"
                                        className={styles.dangerButton}
                                        onClick={() =>
                                            void handleDelete(attribute)
                                        }
                                        disabled={deleteAttribute.isPending}
                                    >
                                        {deleteAttribute.isPending
                                            ? t(
                                                  'admin.productTypes.attributes.deleting',
                                              )
                                            : t('common.delete')}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
};
