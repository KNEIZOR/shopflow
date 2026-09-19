import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import type { Category } from '@/entities/category';

import styles from './CategoryForm.module.scss';

type CategoryFormState = {
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
};

type CategoryFormProps = {
    category?: Category | null;
    isSubmitting: boolean;
    onSubmit: (data: CategoryFormState) => void;
    onCancel: () => void;
};

const normalizeSlug = (value: string): string =>
    value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

export const CategoryForm = ({
    category,
    isSubmitting,
    onSubmit,
    onCancel,
}: CategoryFormProps) => {
    const { t } = useTranslation();

    const isEditing = Boolean(category);

    const [form, setForm] = useState<CategoryFormState>(() => ({
        name: category?.name ?? '',
        slug: category?.slug ?? '',
        description: category?.description ?? '',
        imageUrl: category?.imageUrl ?? '',
    }));

    const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);

    const [error, setError] = useState('');

    const handleNameChange = (value: string) => {
        setForm((current) => ({
            ...current,
            name: value,
            slug: slugManuallyEdited ? current.slug : normalizeSlug(value),
        }));
    };

    const handleSlugChange = (value: string) => {
        setSlugManuallyEdited(true);

        setForm((current) => ({
            ...current,
            slug: normalizeSlug(value),
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const name = form.name.trim();
        const slug = form.slug.trim();
        const description = form.description.trim();
        const imageUrl = form.imageUrl.trim();

        if (name.length < 2) {
            setError(t('admin.categories.validation.name'));
            return;
        }

        if (slug.length < 2) {
            setError(t('admin.categories.validation.slug'));
            return;
        }

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            setError(t('admin.categories.validation.slugFormat'));
            return;
        }

        if (imageUrl) {
            try {
                new URL(imageUrl);
            } catch {
                setError(t('admin.categories.validation.imageUrl'));
                return;
            }
        }

        setError('');

        onSubmit({
            name,
            slug,
            description,
            imageUrl,
        });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>
                        {isEditing
                            ? t('admin.categories.form.editEyebrow')
                            : t('admin.categories.form.createEyebrow')}
                    </span>

                    <h2 className={styles.title}>
                        {isEditing
                            ? t('admin.categories.form.editTitle')
                            : t('admin.categories.form.createTitle')}
                    </h2>
                </div>
            </div>

            <div className={styles.fields}>
                <label className={styles.field}>
                    <span>{t('admin.categories.fields.name')}</span>

                    <input
                        value={form.name}
                        onChange={(event) =>
                            handleNameChange(event.target.value)
                        }
                        placeholder={t(
                            'admin.categories.fields.namePlaceholder',
                        )}
                        disabled={isSubmitting}
                    />
                </label>

                <label className={styles.field}>
                    <span>{t('admin.categories.fields.slug')}</span>

                    <input
                        value={form.slug}
                        onChange={(event) =>
                            handleSlugChange(event.target.value)
                        }
                        placeholder={t(
                            'admin.categories.fields.slugPlaceholder',
                        )}
                        disabled={isSubmitting}
                    />
                </label>

                <label className={styles.fieldFull}>
                    <span>{t('admin.categories.fields.description')}</span>

                    <textarea
                        value={form.description}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                description: event.target.value,
                            }))
                        }
                        placeholder={t(
                            'admin.categories.fields.descriptionPlaceholder',
                        )}
                        rows={5}
                        maxLength={500}
                        disabled={isSubmitting}
                    />
                </label>

                <label className={styles.fieldFull}>
                    <span>{t('admin.categories.fields.imageUrl')}</span>

                    <input
                        type="url"
                        value={form.imageUrl}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                imageUrl: event.target.value,
                            }))
                        }
                        placeholder={t(
                            'admin.categories.fields.imageUrlPlaceholder',
                        )}
                        disabled={isSubmitting}
                    />
                </label>
            </div>

            {error && (
                <div className={styles.error} role="alert">
                    {error}
                </div>
            )}

            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    {t('admin.categories.actions.cancel')}
                </button>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? t('admin.categories.actions.saving')
                        : isEditing
                          ? t('admin.categories.actions.save')
                          : t('admin.categories.actions.create')}
                </button>
            </div>
        </form>
    );
};
