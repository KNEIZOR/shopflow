import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ProductAttributeValue } from '@/entities/product';
import type { ProductTypeAttribute } from '@/entities/product-type';
import { useToast } from '@/shared/ui/Toast';

import {
    useCreateProductAttribute,
    useDeleteProductAttribute,
    useProductAttributes,
    useProductType,
    useUpdateProductAttribute,
} from '../../model';

import { ProductAttributeField } from './ProductAttributeField';

import styles from './ProductAttributes.module.scss';

type ProductAttributesProps = {
    productId: string;
    productTypeId: string | null;
};

type AttributeValue = string | number | boolean | undefined;

type AttributeState = Record<string, AttributeValue>;

type ProductAttributesFormProps = {
    productId: string;
    productType: NonNullable<ReturnType<typeof useProductType>['data']>;
    productAttributes: ProductAttributeValue[];
};

const normalizeExistingValue = (
    attribute: ProductTypeAttribute,
    value: ProductAttributeValue | undefined,
): AttributeValue => {
    if (!value) {
        return undefined;
    }

    if (attribute.type === 'NUMBER') {
        const numericValue = Number(value.value);

        return Number.isFinite(numericValue) ? numericValue : undefined;
    }

    if (attribute.type === 'BOOLEAN') {
        if (typeof value.value === 'boolean') {
            return value.value;
        }

        return value.value === 'true';
    }

    return String(value.value);
};

const createInitialValues = (
    attributes: ProductTypeAttribute[],
    productAttributes: ProductAttributeValue[],
): AttributeState => {
    const values: AttributeState = {};

    attributes.forEach((attribute) => {
        const existingValue = productAttributes.find(
            (item) => item.attributeId === attribute.attributeId,
        );

        values[attribute.attributeId] = normalizeExistingValue(
            attribute,
            existingValue,
        );
    });

    return values;
};

const isSameValue = (
    first: AttributeValue,
    second: AttributeValue,
): boolean => {
    return first === second;
};

const ProductAttributesForm = ({
    productId,
    productType,
    productAttributes,
}: ProductAttributesFormProps) => {
    const { t } = useTranslation();
    const { showToast } = useToast();

    const attributes = useMemo<ProductTypeAttribute[]>(
        () =>
            productType.attributes
                .filter(
                    (attribute) =>
                        attribute.scope === 'PRODUCT' ||
                        attribute.scope === 'BOTH',
                )
                .sort((first, second) => first.position - second.position),
        [productType.attributes],
    );

    const initialValues = useMemo(
        () => createInitialValues(attributes, productAttributes),
        [attributes, productAttributes],
    );

    const [values, setValues] = useState<AttributeState>(initialValues);

    const [isSaving, setIsSaving] = useState(false);

    const createAttribute = useCreateProductAttribute();

    const updateAttribute = useUpdateProductAttribute();

    const deleteAttribute = useDeleteProductAttribute();

    const handleChange = (attributeId: string, value: AttributeValue) => {
        setValues((current) => ({
            ...current,
            [attributeId]: value,
        }));
    };

    const validate = (): string | null => {
        for (const attribute of attributes) {
            const value = values[attribute.attributeId];

            if (attribute.isRequired && (value === undefined || value === '')) {
                return t('admin.products.attributes.required', {
                    attribute: attribute.name,
                });
            }

            if (
                attribute.type === 'NUMBER' &&
                value !== undefined &&
                typeof value !== 'number'
            ) {
                return t('admin.products.attributes.invalidNumber', {
                    attribute: attribute.name,
                });
            }
        }

        return null;
    };

    const handleSave = async () => {
        if (isSaving) {
            return;
        }

        const validationError = validate();

        if (validationError) {
            showToast({
                type: 'error',
                message: validationError,
            });

            return;
        }

        setIsSaving(true);

        try {
            for (const attribute of attributes) {
                const attributeId = attribute.attributeId;

                const currentValue = values[attributeId];

                const previousValue = initialValues[attributeId];

                if (isSameValue(currentValue, previousValue)) {
                    continue;
                }

                const existingValue = productAttributes.find(
                    (item) => item.attributeId === attributeId,
                );

                const isEmpty =
                    currentValue === undefined || currentValue === '';

                if (isEmpty) {
                    if (existingValue) {
                        await deleteAttribute.mutateAsync({
                            productId,
                            attributeId,
                        });
                    }

                    continue;
                }

                if (existingValue) {
                    await updateAttribute.mutateAsync({
                        productId,
                        attributeId,
                        input: {
                            value: currentValue,
                        },
                    });

                    continue;
                }

                await createAttribute.mutateAsync({
                    productId,
                    input: {
                        attributeId,
                        value: currentValue,
                    },
                });
            }

            showToast({
                type: 'success',
                message: t('admin.products.attributes.saved'),
            });
        } catch (error) {
            showToast({
                type: 'error',
                message:
                    error instanceof Error ? error.message : t('common.error'),
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (attributes.length === 0) {
        return (
            <section className={styles.section}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.icon}>A</div>

                        <div>
                            <h2 className={styles.title}>
                                {t('admin.products.attributes.title')}
                            </h2>

                            <p className={styles.description}>
                                {productType.name}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>—</div>

                    <div>
                        <strong>{t('admin.products.attributes.empty')}</strong>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.icon}>A</div>

                    <div>
                        <div className={styles.titleRow}>
                            <h2 className={styles.title}>
                                {t('admin.products.attributes.title')}
                            </h2>

                            <span className={styles.count}>
                                {attributes.length}
                            </span>
                        </div>

                        <p className={styles.description}>{productType.name}</p>
                    </div>
                </div>
            </div>

            <div className={styles.form}>
                <div className={styles.fields}>
                    {attributes.map((attribute) => (
                        <ProductAttributeField
                            key={attribute.attributeId}
                            attribute={attribute}
                            value={values[attribute.attributeId]}
                            disabled={isSaving}
                            onChange={(value) =>
                                handleChange(attribute.attributeId, value)
                            }
                        />
                    ))}
                </div>

                <div className={styles.actions}>
                    <div className={styles.actionsInfo}>
                        <span className={styles.actionsDot} />

                        <span>{t('common.save')}</span>
                    </div>

                    <button
                        type="button"
                        className={styles.saveButton}
                        disabled={isSaving}
                        onClick={handleSave}
                    >
                        {isSaving ? t('common.saving') : t('common.save')}
                    </button>
                </div>
            </div>
        </section>
    );
};

export const ProductAttributes = ({
    productId,
    productTypeId,
}: ProductAttributesProps) => {
    const { t } = useTranslation();

    const {
        data: productType,
        isLoading: isProductTypeLoading,
        isError: isProductTypeError,
    } = useProductType(productTypeId ?? undefined);

    const {
        data: productAttributesResponse,
        isLoading: isAttributesLoading,
        isError: isAttributesError,
    } = useProductAttributes(productId, Boolean(productTypeId));

    const productAttributes = productAttributesResponse?.items ?? [];

    if (!productTypeId) {
        return (
            <section className={styles.section}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.icon}>A</div>

                        <div>
                            <h2 className={styles.title}>
                                {t('admin.products.attributes.title')}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>+</div>

                    <p className={styles.emptyTitle}>
                        {t('admin.products.attributes.selectProductType')}
                    </p>
                </div>
            </section>
        );
    }

    if (isProductTypeLoading || isAttributesLoading) {
        return (
            <section className={styles.section}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.icon}>A</div>

                        <h2 className={styles.title}>
                            {t('admin.products.attributes.title')}
                        </h2>
                    </div>
                </div>

                <div className={styles.loading}>
                    <span className={styles.spinner} />

                    <span>{t('common.loading')}</span>
                </div>
            </section>
        );
    }

    if (isProductTypeError || isAttributesError || !productType) {
        return (
            <section className={styles.section}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.icon}>A</div>

                        <h2 className={styles.title}>
                            {t('admin.products.attributes.title')}
                        </h2>
                    </div>
                </div>

                <div className={styles.error}>{t('common.error')}</div>
            </section>
        );
    }

    const formKey = [
        productType.id,
        ...productAttributes.map(
            (attribute) => `${attribute.id}:${String(attribute.value)}`,
        ),
    ].join('|');

    return (
        <ProductAttributesForm
            key={formKey}
            productId={productId}
            productType={productType}
            productAttributes={productAttributes}
        />
    );
};
