import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCategories } from '@/entities/category';
import { useLocale } from '@/entities/locale';
import type { Product, ProductStatus } from '@/entities/product';
import type { ProductType } from '@/entities/product-type';
import { useToast } from '@/shared/ui/Toast';

import { useProductTypes, useUpdateProduct } from '../../model';

import styles from './ProductBasicInfo.module.scss';

type ProductBasicInfoFormProps = {
    product: Product;
    onClose: () => void;
};

type FormErrors = {
    name?: string;
    slug?: string;
    categoryId?: string;
    productTypeId?: string;
};

type ProductTypeSelection = string | null;

const PRODUCT_STATUSES: ProductStatus[] = ['DRAFT', 'ACTIVE', 'ARCHIVED'];

const getStatusTranslationKey = (status: ProductStatus) =>
    `admin.products.status.${status.toLowerCase()}`;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

    const {
        data: productTypesResponse,
        isLoading: isProductTypesLoading,
        isError: isProductTypesError,
    } = useProductTypes();

    const productTypes = productTypesResponse?.items ?? [];

    const [name, setName] = useState(product.name);

    const [slug, setSlug] = useState(product.slug);

    const [description, setDescription] = useState(product.description ?? '');

    const [status, setStatus] = useState<ProductStatus>(product.status);

    const [categoryId, setCategoryId] = useState(product.category.id);

    const [productTypeId, setProductTypeId] = useState<ProductTypeSelection>(
        product.productType?.id ?? null,
    );

    const [errors, setErrors] = useState<FormErrors>({});

    const isSaving = updateProduct.isPending;

    const isCategorySelectionDisabled =
        isSaving ||
        isCategoriesLoading ||
        isCategoriesError ||
        categories.length === 0;

    const isProductTypeSelectionDisabled =
        isSaving || isProductTypesLoading || isProductTypesError;

    const clearError = (field: keyof FormErrors) => {
        setErrors((current) => {
            if (!current[field]) {
                return current;
            }

            const next = {
                ...current,
            };

            delete next[field];

            return next;
        });
    };

    const handleNameChange = (value: string) => {
        setName(value);
        clearError('name');
    };

    const handleSlugChange = (value: string) => {
        setSlug(value);
        clearError('slug');
    };

    const handleCategoryChange = (value: string) => {
        setCategoryId(value);
        clearError('categoryId');
    };

    const handleProductTypeChange = (value: string) => {
        setProductTypeId(value.trim() || null);

        clearError('productTypeId');
    };

    const validate = (): FormErrors => {
        const nextErrors: FormErrors = {};

        const trimmedName = name.trim();

        const trimmedSlug = slug.trim();

        if (!trimmedName) {
            nextErrors.name = t('admin.products.validation.nameRequired');
        } else if (trimmedName.length < 2) {
            nextErrors.name = t('admin.products.validation.nameMin');
        }

        if (!trimmedSlug) {
            nextErrors.slug = t('admin.products.validation.slugRequired');
        } else if (!SLUG_PATTERN.test(trimmedSlug)) {
            nextErrors.slug = t('admin.products.validation.slugFormat');
        }

        if (!categoryId) {
            nextErrors.categoryId = t(
                'admin.products.validation.categoryRequired',
            );
        }

        return nextErrors;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSaving) {
            return;
        }

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            return;
        }

        const trimmedName = name.trim();

        const trimmedSlug = slug.trim();

        const trimmedDescription = description.trim();

        const selectedCategory = categories.find(
            (category) => category.id === categoryId,
        );

        if (!selectedCategory) {
            setErrors({
                categoryId: t('admin.products.validation.categoryRequired'),
            });

            return;
        }

        if (
            productTypeId !== null &&
            !productTypes.some(
                (productType: ProductType) => productType.id === productTypeId,
            )
        ) {
            setErrors({
                productTypeId: t(
                    'admin.products.validation.productTypeInvalid',
                ),
            });

            return;
        }

        try {
            await updateProduct.mutateAsync({
                id: product.id,

                input: {
                    name: trimmedName,
                    slug: trimmedSlug,
                    description: trimmedDescription,
                    status,
                    categoryId,

                    productTypeId: productTypeId,
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
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formGrid}>
                <label className={`${styles.field} ${styles.fullWidth}`}>
                    <span>{t('admin.products.name')}</span>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                            handleNameChange(event.target.value)
                        }
                        disabled={isSaving}
                        autoComplete="off"
                        aria-invalid={Boolean(errors.name)}
                    />

                    {errors.name && (
                        <span className={styles.error}>{errors.name}</span>
                    )}
                </label>

                <label className={`${styles.field} ${styles.fullWidth}`}>
                    <span>{t('admin.products.slug')}</span>

                    <input
                        type="text"
                        value={slug}
                        onChange={(event) =>
                            handleSlugChange(event.target.value)
                        }
                        disabled={isSaving}
                        autoComplete="off"
                        spellCheck={false}
                        aria-invalid={Boolean(errors.slug)}
                    />

                    {errors.slug && (
                        <span className={styles.error}>{errors.slug}</span>
                    )}
                </label>

                <label className={styles.field}>
                    <span>{t('admin.products.category')}</span>

                    <select
                        value={categoryId}
                        onChange={(event) =>
                            handleCategoryChange(event.target.value)
                        }
                        disabled={isCategorySelectionDisabled}
                        aria-invalid={Boolean(errors.categoryId)}
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

                    {errors.categoryId && (
                        <span className={styles.error}>
                            {errors.categoryId}
                        </span>
                    )}
                </label>

                <label className={styles.field}>
                    <span>{t('admin.products.productType')}</span>

                    <select
                        value={productTypeId ?? ''}
                        onChange={(event) =>
                            handleProductTypeChange(event.target.value)
                        }
                        disabled={isProductTypeSelectionDisabled}
                        aria-invalid={Boolean(errors.productTypeId)}
                    >
                        <option value="">
                            {t('admin.products.productTypePlaceholder')}
                        </option>

                        {isProductTypesLoading && (
                            <option value="" disabled>
                                {t('common.loading')}
                            </option>
                        )}

                        {!isProductTypesLoading && isProductTypesError && (
                            <option value="" disabled>
                                {t('common.error')}
                            </option>
                        )}

                        {!isProductTypesLoading &&
                            !isProductTypesError &&
                            productTypes.map((productType: ProductType) => (
                                <option
                                    key={productType.id}
                                    value={productType.id}
                                >
                                    {productType.name}
                                </option>
                            ))}
                    </select>

                    {errors.productTypeId && (
                        <span className={styles.error}>
                            {errors.productTypeId}
                        </span>
                    )}
                </label>

                <label className={styles.field}>
                    <span>{t('admin.products.status.label')}</span>

                    <select
                        value={status}
                        onChange={(event) => {
                            const nextStatus = event.target
                                .value as ProductStatus;

                            setStatus(nextStatus);
                        }}
                        disabled={isSaving}
                    >
                        {PRODUCT_STATUSES.map((item) => (
                            <option key={item} value={item}>
                                {t(getStatusTranslationKey(item))}
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
                        isProductTypesLoading ||
                        isProductTypesError ||
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
