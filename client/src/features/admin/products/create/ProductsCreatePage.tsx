import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useCreateProduct } from '@/features/admin/product/model';

import { useCategories } from '@/entities/category';
import { useLocale } from '@/entities/locale';

import type { CreateProductInput, ProductStatus } from '@/entities/product';

import { CURRENCIES } from '@/shared/config/currencies';
import { useToast } from '@/shared/ui/Toast';

import styles from './ProductsCreatePage.module.scss';

type FormState = {
    name: string;
    slug: string;
    description: string;
    price: string;
    categoryId: string;
    status: ProductStatus;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
    name: '',
    slug: '',
    description: '',
    price: '2599',
    categoryId: '',
    status: 'DRAFT',
};

const PRODUCT_STATUSES: ProductStatus[] = ['DRAFT', 'ACTIVE', 'ARCHIVED'];

const BASE_CURRENCY = 'RUB' as const;

const BASE_CURRENCY_SYMBOL =
    CURRENCIES.find(({ code }) => code === BASE_CURRENCY)?.symbol ??
    BASE_CURRENCY;

const CYRILLIC_TO_LATIN: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'c',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
};

const createSlug = (value: string): string => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[а-яё]/g, (character) => {
            return CYRILLIC_TO_LATIN[character] ?? character;
        })
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const normalizeSlug = (value: string): string => {
    return createSlug(value);
};

const parsePrice = (value: string): number | null => {
    const normalized = value.replace(',', '.').trim();

    if (!normalized) {
        return null;
    }

    const parsed = Number(normalized);

    if (!Number.isFinite(parsed) || parsed < 0) {
        return null;
    }

    return parsed;
};

export const ProductsCreatePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { language } = useLocale();

    const {
        data: categories = [],
        isLoading: isCategoriesLoading,
        isError: isCategoriesError,
    } = useCategories(language);

    const { mutateAsync: createProduct, isPending } = useCreateProduct();

    const { showToast } = useToast();

    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    const selectedCategory = useMemo(
        () => categories.find((category) => category.id === form.categoryId),
        [categories, form.categoryId],
    );

    const updateField = <K extends keyof FormState>(
        field: K,
        value: FormState[K],
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

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

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setForm((current) => ({
            ...current,
            name: value,
            slug: isSlugManuallyEdited ? current.slug : createSlug(value),
        }));

        setErrors((current) => {
            if (!current.name) {
                return current;
            }

            const next = {
                ...current,
            };

            delete next.name;

            return next;
        });
    };

    const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = normalizeSlug(event.target.value);

        setIsSlugManuallyEdited(true);

        updateField('slug', value);
    };

    const validate = (): FormErrors => {
        const nextErrors: FormErrors = {};

        const name = form.name.trim();
        const slug = form.slug.trim();
        const price = parsePrice(form.price);

        if (!name) {
            nextErrors.name = t(
                'admin.products.create.validation.nameRequired',
            );
        } else if (name.length < 2) {
            nextErrors.name = t('admin.products.create.validation.nameMin');
        }

        if (!slug) {
            nextErrors.slug = t(
                'admin.products.create.validation.slugRequired',
            );
        } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            nextErrors.slug = t('admin.products.create.validation.slugFormat');
        }

        if (price === null) {
            nextErrors.price = t(
                'admin.products.create.validation.priceRequired',
            );
        }

        if (!form.categoryId) {
            nextErrors.categoryId = t(
                'admin.products.create.validation.categoryRequired',
            );
        }

        return nextErrors;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isPending || isCategoriesLoading || isCategoriesError) {
            return;
        }

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const price = parsePrice(form.price);

        if (price === null) {
            return;
        }

        const input: CreateProductInput = {
            name: form.name.trim(),
            slug: form.slug.trim(),
            description: form.description.trim() || undefined,
            price,
            categoryId: form.categoryId,
            status: form.status,
        };

        try {
            const product = await createProduct(input);

            showToast({
                type: 'success',
                message: t('admin.products.create.success'),
            });

            navigate(`/admin/product/${product.slug}`, {
                replace: true,
            });
        } catch (error) {
            showToast({
                type: 'error',
                message:
                    error instanceof Error ? error.message : t('common.error'),
            });
        }
    };

    const handleCancel = () => {
        if (isPending) {
            return;
        }

        navigate('/admin/products');
    };

    const isSubmitDisabled =
        isPending || isCategoriesLoading || isCategoriesError;

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>
                        {t('admin.products.create.eyebrow')}
                    </p>

                    <h1 className={styles.title}>
                        {t('admin.products.create.title')}
                    </h1>

                    <p className={styles.description}>
                        {t('admin.products.create.description')}
                    </p>
                </div>

                <button
                    type="button"
                    className={styles.backButton}
                    onClick={handleCancel}
                    disabled={isPending}
                >
                    {t('admin.products.create.back')}
                </button>
            </header>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <p className={styles.cardEyebrow}>
                                {t('admin.products.create.basic.eyebrow')}
                            </p>

                            <h2 className={styles.cardTitle}>
                                {t('admin.products.create.basic.title')}
                            </h2>
                        </div>
                    </div>

                    <div className={styles.fields}>
                        <label className={styles.field}>
                            <span className={styles.label}>
                                {t('admin.products.create.fields.name')}
                            </span>

                            <input
                                type="text"
                                value={form.name}
                                onChange={handleNameChange}
                                placeholder={t(
                                    'admin.products.create.fields.namePlaceholder',
                                )}
                                className={
                                    errors.name ? styles.inputError : undefined
                                }
                                disabled={isPending}
                                autoComplete="off"
                                autoFocus
                            />

                            {errors.name && (
                                <span className={styles.error}>
                                    {errors.name}
                                </span>
                            )}
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>
                                {t('admin.products.create.fields.slug')}
                            </span>

                            <div className={styles.slugField}>
                                <span
                                    className={styles.slugPrefix}
                                    aria-hidden="true"
                                >
                                    /
                                </span>

                                <input
                                    type="text"
                                    value={form.slug}
                                    onChange={handleSlugChange}
                                    placeholder={t(
                                        'admin.products.create.fields.slugPlaceholder',
                                    )}
                                    className={
                                        errors.slug
                                            ? styles.inputError
                                            : undefined
                                    }
                                    disabled={isPending}
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                            </div>

                            {errors.slug && (
                                <span className={styles.error}>
                                    {errors.slug}
                                </span>
                            )}
                        </label>

                        <label
                            className={`${styles.field} ${styles.fieldFull}`}
                        >
                            <span className={styles.label}>
                                {t('admin.products.create.fields.description')}
                            </span>

                            <textarea
                                value={form.description}
                                onChange={(event) =>
                                    updateField(
                                        'description',
                                        event.target.value,
                                    )
                                }
                                placeholder={t(
                                    'admin.products.create.fields.descriptionPlaceholder',
                                )}
                                rows={6}
                                disabled={isPending}
                            />
                        </label>
                    </div>
                </section>

                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <p className={styles.cardEyebrow}>
                                {t('admin.products.create.catalog.eyebrow')}
                            </p>

                            <h2 className={styles.cardTitle}>
                                {t('admin.products.create.catalog.title')}
                            </h2>
                        </div>
                    </div>

                    <div className={styles.fields}>
                        <label className={styles.field}>
                            <span className={styles.label}>
                                {t('admin.products.create.fields.category')}
                            </span>

                            <select
                                value={form.categoryId}
                                onChange={(event) =>
                                    updateField(
                                        'categoryId',
                                        event.target.value,
                                    )
                                }
                                className={
                                    errors.categoryId
                                        ? styles.inputError
                                        : undefined
                                }
                                disabled={isSubmitDisabled}
                            >
                                <option value="">
                                    {isCategoriesLoading
                                        ? t('common.loading')
                                        : t(
                                              'admin.products.create.fields.categoryPlaceholder',
                                          )}
                                </option>

                                {!isCategoriesLoading &&
                                    !isCategoriesError &&
                                    categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                            </select>

                            {errors.categoryId && (
                                <span className={styles.error}>
                                    {errors.categoryId}
                                </span>
                            )}

                            {isCategoriesError && (
                                <span className={styles.error}>
                                    {t('common.error')}
                                </span>
                            )}

                            {selectedCategory && (
                                <span className={styles.helper}>
                                    /{selectedCategory.slug}
                                </span>
                            )}
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>
                                {t('admin.products.create.fields.status')}
                            </span>

                            <select
                                value={form.status}
                                onChange={(event) =>
                                    updateField(
                                        'status',
                                        event.target.value as ProductStatus,
                                    )
                                }
                                disabled={isPending}
                            >
                                {PRODUCT_STATUSES.map((status) => (
                                    <option key={status} value={status}>
                                        {t(
                                            `admin.products.status.${status.toLowerCase()}`,
                                        )}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>
                                {t('admin.products.create.fields.price')}
                            </span>

                            <div className={styles.priceField}>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={form.price}
                                    onChange={(event) =>
                                        updateField('price', event.target.value)
                                    }
                                    placeholder="2599.00"
                                    className={
                                        errors.price
                                            ? styles.inputError
                                            : undefined
                                    }
                                    disabled={isPending}
                                    autoComplete="off"
                                />

                                <span className={styles.currency}>
                                    {BASE_CURRENCY_SYMBOL} {BASE_CURRENCY}
                                </span>
                            </div>

                            {errors.price && (
                                <span className={styles.error}>
                                    {errors.price}
                                </span>
                            )}

                            <span className={styles.helper}>
                                {t('admin.products.create.fields.priceHelper')}
                            </span>
                        </label>
                    </div>
                </section>

                <footer className={styles.footer}>
                    <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={handleCancel}
                        disabled={isPending}
                    >
                        {t('admin.products.create.cancel')}
                    </button>

                    <button
                        type="submit"
                        className={styles.primaryButton}
                        disabled={isSubmitDisabled}
                    >
                        {isPending
                            ? t('admin.products.create.creating')
                            : t('admin.products.create.submit')}
                    </button>
                </footer>
            </form>
        </section>
    );
};
