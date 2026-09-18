import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    useCreateProductTypeAttribute,
    useUpdateProductTypeAttribute,
} from '@/features/admin/product/model';

import type {
    ProductAttributeScope,
    ProductAttributeType,
    ProductTypeAttribute,
} from '@/entities/product-type';

import styles from './ProductTypeAttributeForm.module.scss';

type ProductTypeAttributeFormProps = {
    productTypeId: string;
    attributeId?: string;
    attribute?: ProductTypeAttribute;
    onClose: () => void;
};

type FormState = {
    name: string;
    slug: string;
    description: string;
    type: ProductAttributeType;
    scope: ProductAttributeScope;
    isRequired: boolean;
    position: string;
};

const createFormState = (attribute?: ProductTypeAttribute): FormState => ({
    name: attribute?.name ?? '',
    slug: attribute?.slug ?? '',
    description: attribute?.description ?? '',
    type: attribute?.type ?? 'TEXT',
    scope: attribute?.scope ?? 'PRODUCT',
    isRequired: attribute?.isRequired ?? false,
    position: String(attribute?.position ?? 0),
});

const normalizeSlug = (value: string): string => {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export const ProductTypeAttributeForm = ({
    productTypeId,
    attributeId,
    attribute,
    onClose,
}: ProductTypeAttributeFormProps) => {
    const { t } = useTranslation();

    const createAttribute = useCreateProductTypeAttribute();
    const updateAttribute = useUpdateProductTypeAttribute();

    const isEditing = Boolean(attributeId);

    const [form, setForm] = useState<FormState>(createFormState(attribute));

    const [error, setError] = useState<string | null>(null);

    const isSubmitting = createAttribute.isPending || updateAttribute.isPending;

    const handleChange = <K extends keyof FormState>(
        field: K,
        value: FormState[K],
    ): void => {
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

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        setError(null);

        const name = form.name.trim();
        const slug = form.slug.trim();
        const description = form.description.trim();
        const position = Number(form.position);

        if (name.length < 2) {
            setError(t('admin.productTypes.attributes.validation.nameMin'));

            return;
        }

        if (slug.length < 2) {
            setError(
                t('admin.productTypes.attributes.validation.slugRequired'),
            );

            return;
        }

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            setError(t('admin.productTypes.attributes.validation.slugFormat'));

            return;
        }

        if (!Number.isInteger(position) || position < 0) {
            setError(t('admin.productTypes.attributes.validation.position'));

            return;
        }

        try {
            if (attributeId) {
                await updateAttribute.mutateAsync({
                    productTypeId,
                    attributeId,
                    input: {
                        name,
                        slug,
                        description,
                        type: form.type,
                        scope: form.scope,
                        isRequired: form.isRequired,
                        position,
                    },
                });
            } else {
                await createAttribute.mutateAsync({
                    productTypeId,
                    input: {
                        name,
                        slug,
                        description,
                        type: form.type,
                        scope: form.scope,
                        isRequired: form.isRequired,
                        position,
                    },
                });
            }

            onClose();
        } catch {
            setError(t('admin.productTypes.attributes.errors.save'));
        }
    };

    return (
        <div className={styles.formCard}>
            <div className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>
                        {isEditing
                            ? t(
                                  'admin.productTypes.attributes.form.editEyebrow',
                              )
                            : t(
                                  'admin.productTypes.attributes.form.createEyebrow',
                              )}
                    </p>

                    <h4 className={styles.title}>
                        {isEditing
                            ? t('admin.productTypes.attributes.form.editTitle')
                            : t(
                                  'admin.productTypes.attributes.form.createTitle',
                              )}
                    </h4>
                </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.fields}>
                    <label className={styles.field}>
                        <span className={styles.label}>
                            {t('admin.productTypes.attributes.fields.name')}
                        </span>

                        <input
                            type="text"
                            value={form.name}
                            onChange={(event) =>
                                handleNameChange(event.target.value)
                            }
                            placeholder={t(
                                'admin.productTypes.attributes.fields.namePlaceholder',
                            )}
                            disabled={isSubmitting}
                            autoComplete="off"
                        />
                    </label>

                    <label className={styles.field}>
                        <span className={styles.label}>
                            {t('admin.productTypes.attributes.fields.slug')}
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
                                'admin.productTypes.attributes.fields.slugPlaceholder',
                            )}
                            disabled={isSubmitting}
                            autoComplete="off"
                        />
                    </label>

                    <label className={styles.field}>
                        <span className={styles.label}>
                            {t('admin.productTypes.attributes.fields.type')}
                        </span>

                        <select
                            value={form.type}
                            onChange={(event) =>
                                handleChange(
                                    'type',
                                    event.target.value as ProductAttributeType,
                                )
                            }
                            disabled={isSubmitting}
                        >
                            <option value="TEXT">
                                {t('admin.productTypes.attributes.types.TEXT')}
                            </option>

                            <option value="NUMBER">
                                {t(
                                    'admin.productTypes.attributes.types.NUMBER',
                                )}
                            </option>

                            <option value="BOOLEAN">
                                {t(
                                    'admin.productTypes.attributes.types.BOOLEAN',
                                )}
                            </option>

                            <option value="SELECT">
                                {t(
                                    'admin.productTypes.attributes.types.SELECT',
                                )}
                            </option>
                        </select>
                    </label>

                    <label className={styles.field}>
                        <span className={styles.label}>
                            {t('admin.productTypes.attributes.fields.scope')}
                        </span>

                        <select
                            value={form.scope}
                            onChange={(event) =>
                                handleChange(
                                    'scope',
                                    event.target.value as ProductAttributeScope,
                                )
                            }
                            disabled={isSubmitting}
                        >
                            <option value="PRODUCT">
                                {t(
                                    'admin.productTypes.attributes.scopes.PRODUCT',
                                )}
                            </option>

                            <option value="VARIANT">
                                {t(
                                    'admin.productTypes.attributes.scopes.VARIANT',
                                )}
                            </option>

                            <option value="BOTH">
                                {t('admin.productTypes.attributes.scopes.BOTH')}
                            </option>
                        </select>
                    </label>

                    <label className={styles.field}>
                        <span className={styles.label}>
                            {t('admin.productTypes.attributes.fields.position')}
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

                    <label className={styles.checkboxField}>
                        <input
                            type="checkbox"
                            checked={form.isRequired}
                            onChange={(event) =>
                                handleChange('isRequired', event.target.checked)
                            }
                            disabled={isSubmitting}
                        />

                        <span>
                            {t('admin.productTypes.attributes.fields.required')}
                        </span>
                    </label>

                    <label className={`${styles.field} ${styles.fullWidth}`}>
                        <span className={styles.label}>
                            {t(
                                'admin.productTypes.attributes.fields.description',
                            )}
                        </span>

                        <textarea
                            value={form.description}
                            onChange={(event) =>
                                handleChange('description', event.target.value)
                            }
                            placeholder={t(
                                'admin.productTypes.attributes.fields.descriptionPlaceholder',
                            )}
                            disabled={isSubmitting}
                            rows={3}
                        />
                    </label>
                </div>

                {error && (
                    <p className={styles.error} role="alert">
                        {error}
                    </p>
                )}

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        {t('common.cancel')}
                    </button>

                    <button
                        type="submit"
                        className={styles.primaryButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t('common.saving') : t('common.save')}
                    </button>
                </div>
            </form>
        </div>
    );
};
