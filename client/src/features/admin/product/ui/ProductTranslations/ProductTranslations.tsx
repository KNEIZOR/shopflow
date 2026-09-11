import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    useDeleteProductTranslation,
    useProductTranslations,
    useUpsertProductTranslation,
} from '../../model';

import styles from './ProductTranslations.module.scss';

const PRODUCT_LANGUAGES = [
    {
        code: 'ru',
        label: 'Русский',
    },
    {
        code: 'en',
        label: 'English',
    },
] as const;

type ProductTranslationsProps = {
    productId: string;
};

type TranslationFormProps = {
    language: string;
    languageLabel: string;
    initialName: string;
    initialDescription: string;
    isDefault: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    onSave: (name: string, description: string) => Promise<void>;
    onDelete: () => Promise<void>;
};

export const ProductTranslations = ({
    productId,
}: ProductTranslationsProps) => {
    const { t } = useTranslation();

    const { data, isLoading, isError } = useProductTranslations(productId);

    const upsertTranslation = useUpsertProductTranslation();

    const deleteTranslation = useDeleteProductTranslation();

    if (isLoading) {
        return (
            <section className={styles.card}>
                <h2 className={styles.title}>
                    {t('admin.products.translations')}
                </h2>

                <p className={styles.muted}>{t('common.loading')}</p>
            </section>
        );
    }

    if (isError || !data) {
        return (
            <section className={styles.card}>
                <h2 className={styles.title}>
                    {t('admin.products.translations')}
                </h2>

                <p className={styles.error}>{t('common.error')}</p>
            </section>
        );
    }

    const translationsByLanguage = new Map(
        data.items.map((translation) => [translation.language, translation]),
    );

    const handleSave = async (
        language: string,
        name: string,
        description: string,
    ) => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            return;
        }

        await upsertTranslation.mutateAsync({
            productId,
            language,
            input: {
                name: trimmedName,
                description: description.trim() || null,
            },
        });
    };

    const handleDelete = async (language: string) => {
        if (language === 'ru') {
            return;
        }

        await deleteTranslation.mutateAsync({
            productId,
            language,
        });
    };

    return (
        <section className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>
                        {t('admin.products.translations')}
                    </h2>

                    <p className={styles.description}>
                        {t('admin.products.translationsDescription')}
                    </p>
                </div>
            </div>

            <div className={styles.list}>
                {PRODUCT_LANGUAGES.map((language) => {
                    const translation = translationsByLanguage.get(
                        language.code,
                    );

                    return (
                        <TranslationForm
                            key={language.code}
                            language={language.code}
                            languageLabel={language.label}
                            initialName={translation?.name ?? ''}
                            initialDescription={translation?.description ?? ''}
                            isDefault={language.code === 'ru'}
                            isSaving={upsertTranslation.isPending}
                            isDeleting={deleteTranslation.isPending}
                            onSave={(name, description) =>
                                handleSave(language.code, name, description)
                            }
                            onDelete={() => handleDelete(language.code)}
                        />
                    );
                })}
            </div>
        </section>
    );
};

const TranslationForm = ({
    language,
    languageLabel,
    initialName,
    initialDescription,
    isDefault,
    isSaving,
    isDeleting,
    onSave,
    onDelete,
}: TranslationFormProps) => {
    const { t } = useTranslation();

    const [name, setName] = useState(initialName);

    const [description, setDescription] = useState(initialDescription);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await onSave(name, description);
    };

    return (
        <form className={styles.translation} onSubmit={handleSubmit}>
            <div className={styles.languageHeader}>
                <div>
                    <h3 className={styles.languageTitle}>{languageLabel}</h3>

                    <span className={styles.languageCode}>{language}</span>
                </div>

                {isDefault && (
                    <span className={styles.default}>
                        {t('admin.products.defaultLanguage')}
                    </span>
                )}
            </div>

            <div className={styles.fields}>
                <label className={styles.field}>
                    <span>{t('admin.products.name')}</span>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder={t('admin.products.namePlaceholder')}
                        disabled={isSaving || isDeleting}
                    />
                </label>

                <label className={styles.field}>
                    <span>{t('admin.products.description')}</span>

                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder={t('admin.products.descriptionPlaceholder')}
                        rows={5}
                        disabled={isSaving || isDeleting}
                    />
                </label>
            </div>

            <div className={styles.actions}>
                <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={isSaving || isDeleting || !name.trim()}
                >
                    {isSaving ? t('common.saving') : t('common.save')}
                </button>

                {!isDefault && (
                    <button
                        type="button"
                        className={styles.deleteButton}
                        disabled={isSaving || isDeleting}
                        onClick={onDelete}
                    >
                        {t('common.delete')}
                    </button>
                )}
            </div>
        </form>
    );
};
