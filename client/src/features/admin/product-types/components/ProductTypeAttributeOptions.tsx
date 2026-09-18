import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ProductTypeAttributeOption } from '@/entities/product-type';

import {
    useCreateProductTypeOption,
    useDeleteProductTypeOption,
    useProductTypeOptions,
    useUpdateProductTypeOption,
} from '@/features/admin/product/model';

import styles from './ProductTypeAttributeOptions.module.scss';

type ProductTypeAttributeOptionsProps = {
    productTypeId: string;
    attributeId: string;
    optionCount: number;
};

type OptionFormState = {
    value: string;
    label: string;
    position: string;
};

const createFormState = (
    option?: ProductTypeAttributeOption,
): OptionFormState => ({
    value: option?.value ?? '',
    label: option?.label ?? '',
    position: String(option?.position ?? 0),
});

export const ProductTypeAttributeOptions = ({
    productTypeId,
    attributeId,
    optionCount,
}: ProductTypeAttributeOptionsProps) => {
    const { t } = useTranslation();

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={styles.container}>
            <button
                type="button"
                className={`${styles.toggle} ${
                    isExpanded ? styles.toggleExpanded : ''
                }`}
                onClick={() => setIsExpanded((current) => !current)}
                aria-expanded={isExpanded}
            >
                <span className={styles.toggleContent}>
                    <span className={styles.toggleIcon} aria-hidden="true">
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

                    <span className={styles.toggleLabel}>
                        {t('admin.productTypes.attributes.options.title')}
                    </span>
                </span>

                <span className={styles.toggleCount}>{optionCount}</span>
            </button>

            {isExpanded && (
                <ProductTypeAttributeOptionsContent
                    productTypeId={productTypeId}
                    attributeId={attributeId}
                />
            )}
        </div>
    );
};

type ProductTypeAttributeOptionsContentProps = {
    productTypeId: string;
    attributeId: string;
};

const ProductTypeAttributeOptionsContent = ({
    productTypeId,
    attributeId,
}: ProductTypeAttributeOptionsContentProps) => {
    const { t } = useTranslation();

    const {
        data: options = [],
        isLoading,
        isError,
        refetch,
    } = useProductTypeOptions(productTypeId, attributeId);

    const createOption = useCreateProductTypeOption();
    const updateOption = useUpdateProductTypeOption();
    const deleteOption = useDeleteProductTypeOption();

    const [isCreating, setIsCreating] = useState(false);
    const [editingOptionId, setEditingOptionId] = useState<string | null>(null);

    const [form, setForm] = useState<OptionFormState>(createFormState());

    const [error, setError] = useState<string | null>(null);

    const isSubmitting =
        createOption.isPending ||
        updateOption.isPending ||
        deleteOption.isPending;

    const resetForm = (): void => {
        setForm(createFormState());
        setIsCreating(false);
        setEditingOptionId(null);
        setError(null);
    };

    const handleCreate = (): void => {
        setError(null);
        setForm(createFormState());
        setEditingOptionId(null);
        setIsCreating(true);
    };

    const handleEdit = (option: ProductTypeAttributeOption): void => {
        setError(null);
        setForm(createFormState(option));
        setIsCreating(false);
        setEditingOptionId(option.id);
    };

    const handleChange = <K extends keyof OptionFormState>(
        field: K,
        value: OptionFormState[K],
    ): void => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        setError(null);

        const value = form.value.trim();
        const label = form.label.trim();
        const position = Number(form.position);

        if (value.length < 1) {
            setError(
                t(
                    'admin.productTypes.attributes.options.validation.valueRequired',
                ),
            );

            return;
        }

        if (label.length < 1) {
            setError(
                t(
                    'admin.productTypes.attributes.options.validation.labelRequired',
                ),
            );

            return;
        }

        if (!Number.isInteger(position) || position < 0) {
            setError(
                t('admin.productTypes.attributes.options.validation.position'),
            );

            return;
        }

        try {
            if (editingOptionId) {
                await updateOption.mutateAsync({
                    productTypeId,
                    attributeId,
                    optionId: editingOptionId,
                    input: {
                        value,
                        label,
                        position,
                    },
                });
            } else {
                await createOption.mutateAsync({
                    productTypeId,
                    attributeId,
                    input: {
                        value,
                        label,
                        position,
                    },
                });
            }

            resetForm();
        } catch {
            setError(t('admin.productTypes.attributes.options.errors.save'));
        }
    };

    const handleDelete = async (
        option: ProductTypeAttributeOption,
    ): Promise<void> => {
        const confirmed = window.confirm(
            t('admin.productTypes.attributes.options.deleteConfirm', {
                name: option.label,
            }),
        );

        if (!confirmed) {
            return;
        }

        setError(null);

        try {
            await deleteOption.mutateAsync({
                productTypeId,
                attributeId,
                optionId: option.id,
            });

            if (editingOptionId === option.id) {
                resetForm();
            }
        } catch {
            setError(t('admin.productTypes.attributes.options.errors.delete'));
        }
    };

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                <div>
                    <p className={styles.description}>
                        {t('admin.productTypes.attributes.options.description')}
                    </p>
                </div>

                {!isCreating && !editingOptionId && (
                    <button
                        type="button"
                        className={styles.addButton}
                        onClick={handleCreate}
                        disabled={isSubmitting}
                    >
                        <span aria-hidden="true">+</span>

                        {t('admin.productTypes.attributes.options.create')}
                    </button>
                )}
            </div>

            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}

            {(isCreating || editingOptionId) && (
                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className={styles.formGrid}>
                        <label className={styles.field}>
                            <span className={styles.label}>
                                {t(
                                    'admin.productTypes.attributes.options.fields.value',
                                )}
                            </span>

                            <input
                                type="text"
                                value={form.value}
                                onChange={(event) =>
                                    handleChange('value', event.target.value)
                                }
                                placeholder={t(
                                    'admin.productTypes.attributes.options.fields.valuePlaceholder',
                                )}
                                disabled={isSubmitting}
                                autoComplete="off"
                            />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>
                                {t(
                                    'admin.productTypes.attributes.options.fields.label',
                                )}
                            </span>

                            <input
                                type="text"
                                value={form.label}
                                onChange={(event) =>
                                    handleChange('label', event.target.value)
                                }
                                placeholder={t(
                                    'admin.productTypes.attributes.options.fields.labelPlaceholder',
                                )}
                                disabled={isSubmitting}
                                autoComplete="off"
                            />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>
                                {t(
                                    'admin.productTypes.attributes.options.fields.position',
                                )}
                            </span>

                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={form.position}
                                onChange={(event) =>
                                    handleChange('position', event.target.value)
                                }
                                disabled={isSubmitting}
                            />
                        </label>
                    </div>

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
            )}

            {isLoading && (
                <div className={styles.state}>{t('common.loading')}</div>
            )}

            {isError && !isLoading && (
                <div className={styles.state}>
                    <p>
                        {t('admin.productTypes.attributes.options.errors.load')}
                    </p>

                    <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={() => void refetch()}
                    >
                        {t('admin.productTypes.attributes.options.retry')}
                    </button>
                </div>
            )}

            {!isLoading && !isError && options.length === 0 && (
                <div className={styles.empty}>
                    <p>{t('admin.productTypes.attributes.options.empty')}</p>
                </div>
            )}

            {!isLoading && !isError && options.length > 0 && (
                <div className={styles.list}>
                    {options.map((option) => {
                        const isEditing = editingOptionId === option.id;

                        return (
                            <article
                                key={option.id}
                                className={`${styles.item} ${
                                    isEditing ? styles.itemEditing : ''
                                }`}
                            >
                                <div className={styles.itemInfo}>
                                    <div className={styles.itemMain}>
                                        <span className={styles.itemLabel}>
                                            {option.label}
                                        </span>

                                        <span className={styles.itemValue}>
                                            {option.value}
                                        </span>
                                    </div>

                                    <span className={styles.position}>
                                        #{option.position}
                                    </span>
                                </div>

                                <div className={styles.actions}>
                                    <button
                                        type="button"
                                        className={styles.secondaryButton}
                                        onClick={() => handleEdit(option)}
                                        disabled={isSubmitting}
                                    >
                                        {t('common.edit')}
                                    </button>

                                    <button
                                        type="button"
                                        className={styles.dangerButton}
                                        onClick={() =>
                                            void handleDelete(option)
                                        }
                                        disabled={isSubmitting}
                                    >
                                        {deleteOption.isPending
                                            ? t(
                                                  'admin.productTypes.attributes.options.deleting',
                                              )
                                            : t('common.delete')}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
