import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    useCreateProductType,
    useDeleteProductType,
    useProductTypes,
    useUpdateProductType,
} from '@/features/admin/product/model';

import type {
    CreateProductTypeInput,
    ProductType,
    UpdateProductTypeInput,
} from '@/entities/product-type';

import { ProductTypeAttributes } from './components/ProductTypeAttributes';

import styles from './ProductTypesAdminPage.module.scss';

type FormState = {
    name: string;
    slug: string;
    description: string;
};

const EMPTY_FORM: FormState = {
    name: '',
    slug: '',
    description: '',
};

const createFormState = (productType?: ProductType): FormState => ({
    name: productType?.name ?? '',
    slug: productType?.slug ?? '',
    description: productType?.description ?? '',
});

const normalizeSlug = (value: string): string => {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export const ProductTypesAdminPage = () => {
    const { t } = useTranslation();

    const { data, isLoading, isError, refetch } = useProductTypes();

    const createProductType = useCreateProductType();
    const updateProductType = useUpdateProductType();
    const deleteProductType = useDeleteProductType();

    const [isCreating, setIsCreating] = useState(false);
    const [editingProductTypeId, setEditingProductTypeId] = useState<
        string | null
    >(null);

    const [form, setForm] = useState<FormState>(EMPTY_FORM);

    const [error, setError] = useState<string | null>(null);

    const [expandedProductTypeIds, setExpandedProductTypeIds] = useState<
        Set<string>
    >(new Set());

    const formRef = useRef<HTMLElement | null>(null);

    const productTypes = data?.items ?? [];

    const isSubmitting =
        createProductType.isPending || updateProductType.isPending;

    useEffect(() => {
        if (!isCreating && !editingProductTypeId) {
            return;
        }

        const frameId = window.requestAnimationFrame(() => {
            formRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [isCreating, editingProductTypeId]);

    const resetForm = (): void => {
        setForm(EMPTY_FORM);
        setIsCreating(false);
        setEditingProductTypeId(null);
        setError(null);
    };

    const handleCreate = (): void => {
        setForm(EMPTY_FORM);
        setError(null);
        setEditingProductTypeId(null);
        setIsCreating(true);
    };

    const handleEdit = (productType: ProductType): void => {
        setForm(createFormState(productType));
        setError(null);
        setIsCreating(false);
        setEditingProductTypeId(productType.id);
    };

    const handleChange = (field: keyof FormState, value: string): void => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleNameChange = (value: string): void => {
        setForm((current) => ({
            ...current,
            name: value,
            slug:
                current.slug === '' ||
                current.slug === normalizeSlug(current.name)
                    ? normalizeSlug(value)
                    : current.slug,
        }));
    };

    const handleToggleAttributes = (productTypeId: string): void => {
        setExpandedProductTypeIds((current) => {
            const next = new Set(current);

            if (next.has(productTypeId)) {
                next.delete(productTypeId);
            } else {
                next.add(productTypeId);
            }

            return next;
        });
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        setError(null);

        const name = form.name.trim();
        const slug = form.slug.trim();
        const description = form.description.trim();

        if (name.length < 2) {
            setError(t('admin.productTypes.validation.nameMin'));
            return;
        }

        if (slug.length < 2) {
            setError(t('admin.productTypes.validation.slugRequired'));
            return;
        }

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            setError(t('admin.productTypes.validation.slugFormat'));
            return;
        }

        try {
            if (editingProductTypeId) {
                const input: UpdateProductTypeInput = {
                    name,
                    slug,
                    description,
                };

                await updateProductType.mutateAsync({
                    id: editingProductTypeId,
                    input,
                });
            } else {
                const input: CreateProductTypeInput = {
                    name,
                    slug,
                    description,
                };

                await createProductType.mutateAsync(input);
            }

            resetForm();
        } catch {
            setError(t('admin.productTypes.errors.save'));
        }
    };

    const handleDelete = async (productType: ProductType): Promise<void> => {
        const confirmed = window.confirm(
            t('admin.productTypes.deleteConfirm', {
                name: productType.name,
            }),
        );

        if (!confirmed) {
            return;
        }

        setError(null);

        try {
            await deleteProductType.mutateAsync(productType.id);

            setExpandedProductTypeIds((current) => {
                const next = new Set(current);
                next.delete(productType.id);
                return next;
            });

            if (editingProductTypeId === productType.id) {
                resetForm();
            }
        } catch {
            setError(t('admin.productTypes.errors.delete'));
        }
    };

    const renderForm = () => {
        if (!isCreating && !editingProductTypeId) {
            return null;
        }

        const isEditing = Boolean(editingProductTypeId);

        return (
            <section
                ref={formRef}
                className={styles.formCard}
                style={{ scrollMarginTop: '24px' }}
            >
                <div className={styles.sectionHeader}>
                    <div>
                        <p className={styles.eyebrow}>
                            {isEditing
                                ? t('admin.productTypes.form.editEyebrow')
                                : t('admin.productTypes.form.createEyebrow')}
                        </p>

                        <h2 className={styles.sectionTitle}>
                            {isEditing
                                ? t('admin.productTypes.form.editTitle')
                                : t('admin.productTypes.form.createTitle')}
                        </h2>
                    </div>
                </div>

                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className={styles.fields}>
                        <label className={styles.field}>
                            <span className={styles.label}>
                                {t('admin.productTypes.fields.name')}
                            </span>

                            <input
                                type="text"
                                value={form.name}
                                onChange={(event) =>
                                    handleNameChange(event.target.value)
                                }
                                placeholder={t(
                                    'admin.productTypes.fields.namePlaceholder',
                                )}
                                disabled={isSubmitting}
                                autoComplete="off"
                            />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>
                                {t('admin.productTypes.fields.slug')}
                            </span>

                            <input
                                type="text"
                                value={form.slug}
                                onChange={(event) =>
                                    handleChange(
                                        'slug',
                                        event.target.value.toLowerCase(),
                                    )
                                }
                                placeholder={t(
                                    'admin.productTypes.fields.slugPlaceholder',
                                )}
                                disabled={isSubmitting}
                                autoComplete="off"
                            />
                        </label>

                        <label
                            className={`${styles.field} ${styles.fullWidth}`}
                        >
                            <span className={styles.label}>
                                {t('admin.productTypes.fields.description')}
                            </span>

                            <textarea
                                value={form.description}
                                onChange={(event) =>
                                    handleChange(
                                        'description',
                                        event.target.value,
                                    )
                                }
                                placeholder={t(
                                    'admin.productTypes.fields.descriptionPlaceholder',
                                )}
                                disabled={isSubmitting}
                                rows={4}
                            />
                        </label>
                    </div>

                    {error && (
                        <p className={styles.formError} role="alert">
                            {error}
                        </p>
                    )}

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={resetForm}
                            disabled={isSubmitting}
                        >
                            {t('common.cancel')}
                        </button>

                        <button
                            type="submit"
                            className={styles.primaryButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? t('common.saving')
                                : t('common.save')}
                        </button>
                    </div>
                </form>
            </section>
        );
    };

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>
                        {t('admin.productTypes.eyebrow')}
                    </p>

                    <h1 className={styles.title}>
                        {t('admin.productTypes.title')}
                    </h1>

                    <p className={styles.description}>
                        {t('admin.productTypes.description')}
                    </p>
                </div>

                {!isCreating && !editingProductTypeId && (
                    <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={handleCreate}
                    >
                        {t('admin.productTypes.create')}
                    </button>
                )}
            </header>

            {renderForm()}

            {error && !isCreating && !editingProductTypeId && (
                <p className={styles.formError} role="alert">
                    {error}
                </p>
            )}

            <section className={styles.listCard}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h2 className={styles.sectionTitle}>
                            {t('admin.productTypes.list.title')}
                        </h2>

                        <p className={styles.sectionDescription}>
                            {t('admin.productTypes.list.description')}
                        </p>
                    </div>

                    <span className={styles.count}>{productTypes.length}</span>
                </div>

                {isLoading && (
                    <div className={styles.state}>{t('common.loading')}</div>
                )}

                {isError && !isLoading && (
                    <div className={styles.state}>
                        <p>{t('admin.productTypes.errors.load')}</p>

                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => void refetch()}
                        >
                            {t('admin.productTypes.retry')}
                        </button>
                    </div>
                )}

                {!isLoading && !isError && productTypes.length === 0 && (
                    <div className={styles.empty}>
                        <h3>{t('admin.productTypes.emptyTitle')}</h3>

                        <p>{t('admin.productTypes.emptyDescription')}</p>
                    </div>
                )}

                {!isLoading && !isError && productTypes.length > 0 && (
                    <div className={styles.items}>
                        {productTypes.map((productType) => {
                            const isEditing =
                                editingProductTypeId === productType.id;

                            const isDeleting = deleteProductType.isPending;

                            const isAttributesExpanded =
                                expandedProductTypeIds.has(productType.id);

                            return (
                                <article
                                    key={productType.id}
                                    className={`${styles.item} ${
                                        isEditing ? styles.itemEditing : ''
                                    }`}
                                >
                                    <div className={styles.itemMain}>
                                        <div>
                                            <h3 className={styles.itemTitle}>
                                                {productType.name}
                                            </h3>

                                            <p className={styles.itemSlug}>
                                                {productType.slug}
                                            </p>
                                        </div>

                                        <span className={styles.attributeCount}>
                                            {t(
                                                'admin.productTypes.attributeCount',
                                                {
                                                    count: productType
                                                        .attributes.length,
                                                },
                                            )}
                                        </span>
                                    </div>

                                    {productType.description && (
                                        <p className={styles.itemDescription}>
                                            {productType.description}
                                        </p>
                                    )}

                                    <div className={styles.attributesSection}>
                                        <button
                                            type="button"
                                            className={`${
                                                styles.attributesToggle
                                            } ${
                                                isAttributesExpanded
                                                    ? styles.attributesToggleExpanded
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                handleToggleAttributes(
                                                    productType.id,
                                                )
                                            }
                                            aria-expanded={isAttributesExpanded}
                                        >
                                            <span
                                                className={
                                                    styles.attributesToggleContent
                                                }
                                            >
                                                <span
                                                    className={
                                                        styles.attributesToggleIcon
                                                    }
                                                    aria-hidden="true"
                                                >
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M9 18l6-6-6-6" />
                                                    </svg>
                                                </span>

                                                <span
                                                    className={
                                                        styles.attributesToggleLabel
                                                    }
                                                >
                                                    {t(
                                                        'admin.productTypes.attributes.title',
                                                    )}
                                                </span>
                                            </span>

                                            <span
                                                className={
                                                    styles.attributesToggleCount
                                                }
                                            >
                                                {productType.attributes.length}
                                            </span>
                                        </button>

                                        {isAttributesExpanded && (
                                            <div
                                                className={
                                                    styles.attributesContent
                                                }
                                            >
                                                <ProductTypeAttributes
                                                    productTypeId={
                                                        productType.id
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.itemActions}>
                                        <button
                                            type="button"
                                            className={styles.secondaryButton}
                                            onClick={() =>
                                                handleEdit(productType)
                                            }
                                            disabled={isDeleting}
                                        >
                                            {t('common.edit')}
                                        </button>

                                        <button
                                            type="button"
                                            className={styles.dangerButton}
                                            onClick={() =>
                                                void handleDelete(productType)
                                            }
                                            disabled={isDeleting}
                                        >
                                            {isDeleting
                                                ? t(
                                                      'admin.productTypes.deleting',
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
        </main>
    );
};
