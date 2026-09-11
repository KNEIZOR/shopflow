import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCategories } from '@/entities/category';
import { useLocale } from '@/entities/locale';
import type { Product, ProductStatus } from '@/entities/product';
import { useToast } from '@/shared/ui/Toast';

import { useUpdateProduct } from '../../model';

import styles from './ProductBasicInfo.module.scss';

type ProductBasicInfoFormProps = {
    product: Product;
    onClose: () => void;
};

const PRODUCT_STATUSES: ProductStatus[] = ['DRAFT', 'ACTIVE', 'ARCHIVED'];

export const ProductBasicInfoForm = ({
    product,
    onClose,
}: ProductBasicInfoFormProps) => {
    const { t } = useTranslation();

    const { language } = useLocale();

    const { showToast } = useToast();

    const updateProduct = useUpdateProduct();

    const {
        data: categories = [],
        isLoading: isCategoriesLoading,
        isError: isCategoriesError,
    } = useCategories(language);

    const [name, setName] = useState(product.name);

    const [slug, setSlug] = useState(product.slug);

    const [description, setDescription] = useState(product.description ?? '');

    const [status, setStatus] = useState<ProductStatus>(product.status);

    const [categoryId, setCategoryId] = useState(product.category.id);

    const isSaving = updateProduct.isPending;

    const isCategorySelectionDisabled =
        isSaving ||
        isCategoriesLoading ||
        isCategoriesError ||
        categories.length === 0;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedName = name.trim();
        const trimmedSlug = slug.trim();
        const trimmedDescription = description.trim();

        if (!trimmedName || !trimmedSlug || !categoryId) {
            return;
        }

        const selectedCategory = categories.find(
            (category) => category.id === categoryId,
        );

        if (!selectedCategory) {
            return;
        }

        try {
            await updateProduct.mutateAsync({
                id: product.id,
                input: {
                    name: trimmedName,
                    slug: trimmedSlug,
                    description: trimmedDescription || undefined,
                    status,
                    categoryId,
                },
            });

            showToast({
                type: 'success',
                message: t('admin.products.productUpdated'),
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
                <label className={`${styles.field} ${styles.fullWidth}`}>
                    <span>{t('admin.products.name')}</span>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        disabled={isSaving}
                        autoComplete="off"
                    />
                </label>

                <label className={`${styles.field} ${styles.fullWidth}`}>
                    <span>{t('admin.products.slug')}</span>

                    <input
                        type="text"
                        value={slug}
                        onChange={(event) => setSlug(event.target.value)}
                        disabled={isSaving}
                        autoComplete="off"
                    />
                </label>

                <label className={styles.field}>
                    <span>{t('admin.products.category')}</span>

                    <select
                        value={categoryId}
                        onChange={(event) => setCategoryId(event.target.value)}
                        disabled={isCategorySelectionDisabled}
                    >
                        {isCategoriesLoading && (
                            <option value="">{t('common.loading')}</option>
                        )}

                        {!isCategoriesLoading && isCategoriesError && (
                            <option value="">{t('common.error')}</option>
                        )}

                        {!isCategoriesLoading &&
                            !isCategoriesError &&
                            categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                    </select>
                </label>

                <label className={styles.field}>
                    <span>{t('admin.products.status')}</span>

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(event.target.value as ProductStatus)
                        }
                        disabled={isSaving}
                    >
                        {PRODUCT_STATUSES.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={`${styles.field} ${styles.fullWidth}`}>
                    <span>{t('admin.products.description')}</span>

                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        disabled={isSaving}
                        rows={5}
                    />
                </label>
            </div>

            <div className={styles.formActions}>
                <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={
                        isSaving ||
                        isCategoriesLoading ||
                        isCategoriesError ||
                        !categoryId ||
                        !name.trim() ||
                        !slug.trim()
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
