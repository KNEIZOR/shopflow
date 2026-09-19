import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { Category, CreateCategoryInput } from '@/entities/category';
import { useToast } from '@/shared/ui/Toast';

import { CategoryForm } from './components/CategoryForm';

import {
    useAdminCategories,
    useCreateCategory,
    useDeleteCategory,
    useUpdateCategory,
} from './model';

import styles from './CategoriesAdminPage.module.scss';

type FormState = {
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
};

export const CategoriesAdminPage = () => {
    const { t } = useTranslation();
    const { showToast } = useToast();

    const formRef = useRef<HTMLDivElement>(null);

    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    );

    const [isFormVisible, setIsFormVisible] = useState(false);

    const {
        data: categories = [],
        isLoading,
        isError,
        refetch,
    } = useAdminCategories();

    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const sortedCategories = useMemo(
        () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
        [categories],
    );

    const openCreateForm = () => {
        setEditingCategory(null);
        setIsFormVisible(true);
    };

    const openEditForm = (category: Category) => {
        setEditingCategory(category);
        setIsFormVisible(true);
    };

    useEffect(() => {
        if (!isFormVisible) {
            return;
        }

        requestAnimationFrame(() => {
            formRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });
    }, [isFormVisible, editingCategory]);

    const closeForm = () => {
        if (isSubmitting) {
            return;
        }

        setIsFormVisible(false);
        setEditingCategory(null);
    };

    const handleSubmit = async (form: FormState) => {
        const input: CreateCategoryInput = {
            name: form.name,
            slug: form.slug,
            description: form.description || undefined,
            imageUrl: form.imageUrl || undefined,
        };

        try {
            if (editingCategory) {
                await updateMutation.mutateAsync({
                    id: editingCategory.id,
                    input,
                });

                showToast({
                    type: 'success',
                    message: t('admin.categories.messages.updated'),
                });
            } else {
                await createMutation.mutateAsync(input);

                showToast({
                    type: 'success',
                    message: t('admin.categories.messages.created'),
                });
            }

            closeForm();
        } catch {
            showToast({
                type: 'error',
                message: editingCategory
                    ? t('admin.categories.errors.update')
                    : t('admin.categories.errors.create'),
            });
        }
    };

    const handleDelete = async (category: Category) => {
        const confirmed = window.confirm(
            t('admin.categories.deleteConfirm', {
                name: category.name,
            }),
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteMutation.mutateAsync(category.id);

            if (editingCategory?.id === category.id) {
                closeForm();
            }

            showToast({
                type: 'success',
                message: t('admin.categories.messages.deleted'),
            });
        } catch {
            showToast({
                type: 'error',
                message: t('admin.categories.errors.delete'),
            });
        }
    };

    return (
        <main className={styles.page}>
            <section className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>
                        {t('admin.categories.eyebrow')}
                    </span>

                    <h1 className={styles.title}>
                        {t('admin.categories.title')}
                    </h1>

                    <p className={styles.description}>
                        {t('admin.categories.description')}
                    </p>
                </div>

                <button
                    type="button"
                    className={styles.createButton}
                    onClick={openCreateForm}
                >
                    + {t('admin.categories.actions.create')}
                </button>
            </section>

            {isFormVisible && (
                <section
                    ref={formRef}
                    className={styles.formSection}
                    style={{ scrollMarginTop: '24px' }}
                >
                    <CategoryForm
                        key={editingCategory?.id ?? 'create'}
                        category={editingCategory}
                        isSubmitting={isSubmitting}
                        onSubmit={handleSubmit}
                        onCancel={closeForm}
                    />
                </section>
            )}

            <section className={styles.content}>
                {isLoading && (
                    <div className={styles.state}>
                        {t('admin.categories.states.loading')}
                    </div>
                )}

                {isError && !isLoading && (
                    <div className={styles.state}>
                        <p>{t('admin.categories.states.error')}</p>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            className={styles.retryButton}
                        >
                            {t('admin.categories.actions.retry')}
                        </button>
                    </div>
                )}

                {!isLoading && !isError && sortedCategories.length === 0 && (
                    <div className={styles.state}>
                        <h2>{t('admin.categories.states.emptyTitle')}</h2>

                        <p>{t('admin.categories.states.emptyDescription')}</p>

                        <button
                            type="button"
                            className={styles.createButton}
                            onClick={openCreateForm}
                        >
                            + {t('admin.categories.actions.create')}
                        </button>
                    </div>
                )}

                {!isLoading && !isError && sortedCategories.length > 0 && (
                    <div className={styles.grid}>
                        {sortedCategories.map((category) => (
                            <article key={category.id} className={styles.card}>
                                {category.imageUrl ? (
                                    <img
                                        src={category.imageUrl}
                                        alt={category.name}
                                        className={styles.image}
                                    />
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        {category.name
                                            .slice(0, 1)
                                            .toUpperCase()}
                                    </div>
                                )}

                                <div className={styles.cardBody}>
                                    <div className={styles.cardHeading}>
                                        <h2>{category.name}</h2>

                                        <span className={styles.slug}>
                                            {category.slug}
                                        </span>
                                    </div>

                                    {category.description && (
                                        <p className={styles.cardDescription}>
                                            {category.description}
                                        </p>
                                    )}

                                    <div className={styles.cardActions}>
                                        <button
                                            type="button"
                                            className={styles.editButton}
                                            onClick={() =>
                                                openEditForm(category)
                                            }
                                        >
                                            {t('admin.categories.actions.edit')}
                                        </button>

                                        <button
                                            type="button"
                                            className={styles.deleteButton}
                                            onClick={() =>
                                                handleDelete(category)
                                            }
                                            disabled={deleteMutation.isPending}
                                        >
                                            {deleteMutation.isPending
                                                ? t(
                                                      'admin.categories.actions.deleting',
                                                  )
                                                : t(
                                                      'admin.categories.actions.delete',
                                                  )}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};
