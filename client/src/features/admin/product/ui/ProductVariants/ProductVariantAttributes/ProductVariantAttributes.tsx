import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ProductTypeAttribute } from '@/entities/product-type';
import { useToast } from '@/shared/ui/Toast';

import {
    useCreateProductVariantAttribute,
    useDeleteProductVariantAttribute,
    useProductType,
    useProductVariantAttributes,
    useUpdateProductVariantAttribute,
} from '../../../model';


import { ProductVariantAttributeField } from './ProductVariantAttributeField';

import styles from './ProductVariantAttributes.module.scss';

type AttributeValue = string | number | boolean | undefined;

type ProductVariantAttributesProps = {
    productId: string;
    variantId: string;
    productTypeId: string | null;
};

type ProductVariantAttributesFormProps = {
    attributes: ProductTypeAttribute[];
    existingValues: Map<string, AttributeValue>;
    productId: string;
    variantId: string;
};

const isEmptyValue = (value: AttributeValue): boolean => {
    if (value === undefined) {
        return true;
    }

    if (typeof value === 'string') {
        return value.trim() === '';
    }

    return false;
};

const normalizeValue = (value: AttributeValue): AttributeValue => {
    if (typeof value === 'string') {
        const trimmedValue = value.trim();

        return trimmedValue || undefined;
    }

    return value;
};

const createInitialValues = (
    attributes: ProductTypeAttribute[],
    existingValues: Map<string, AttributeValue>,
): Record<string, AttributeValue> => {
    return attributes.reduce<Record<string, AttributeValue>>(
        (result, attribute) => {
            const existingValue = existingValues.get(attribute.attributeId);

            if (existingValue !== undefined) {
                result[attribute.attributeId] = existingValue;
                return result;
            }

            if (attribute.type === 'BOOLEAN') {
                result[attribute.attributeId] = false;
                return result;
            }

            result[attribute.attributeId] = undefined;

            return result;
        },
        {},
    );
};

const ProductVariantAttributesForm = ({
    attributes,
    existingValues,
    productId,
    variantId,
}: ProductVariantAttributesFormProps) => {
    const { t } = useTranslation();
    const { showToast } = useToast();

    const createAttribute = useCreateProductVariantAttribute();

    const updateAttribute = useUpdateProductVariantAttribute();

    const deleteAttribute = useDeleteProductVariantAttribute();

    const initialValues = useMemo(
        () => createInitialValues(attributes, existingValues),
        [attributes, existingValues],
    );

    const [values, setValues] =
        useState<Record<string, AttributeValue>>(initialValues);

    const isSaving =
        createAttribute.isPending ||
        updateAttribute.isPending ||
        deleteAttribute.isPending;

    const handleChange = (attributeId: string, value: AttributeValue) => {
        setValues((currentValues) => ({
            ...currentValues,
            [attributeId]: value,
        }));
    };

    const validate = (): boolean => {
        for (const attribute of attributes) {
            const value = values[attribute.attributeId];

            if (attribute.isRequired && isEmptyValue(value)) {
                showToast({
                    type: 'error',
                    message: t('admin.products.variantAttributeRequired', {
                        name: attribute.name,
                    }),
                });

                return false;
            }

            if (attribute.type === 'NUMBER' && value !== undefined) {
                const numericValue =
                    typeof value === 'number' ? value : Number(value);

                if (!Number.isFinite(numericValue)) {
                    showToast({
                        type: 'error',
                        message: t(
                            'admin.products.variantAttributeNumberInvalid',
                            {
                                name: attribute.name,
                            },
                        ),
                    });

                    return false;
                }
            }
        }

        return true;
    };

    const handleSave = async () => {
        if (isSaving || !validate()) {
            return;
        }

        try {
            for (const attribute of attributes) {
                const attributeId = attribute.attributeId;

                const currentValue = normalizeValue(values[attributeId]);

                const existingValue = existingValues.get(attributeId);

                if (existingValue === undefined && currentValue === undefined) {
                    continue;
                }

                if (existingValue === undefined && currentValue !== undefined) {
                    await createAttribute.mutateAsync({
                        productId,
                        variantId,
                        input: {
                            attributeId,
                            value: currentValue,
                        },
                    });

                    continue;
                }

                if (existingValue !== undefined && currentValue === undefined) {
                    await deleteAttribute.mutateAsync({
                        productId,
                        variantId,
                        attributeId,
                    });

                    continue;
                }

                if (existingValue !== currentValue) {
                    await updateAttribute.mutateAsync({
                        productId,
                        variantId,
                        attributeId,
                        input: {
                            value: currentValue as string | number | boolean,
                        },
                    });
                }
            }

            showToast({
                type: 'success',
                message: t('admin.products.variantAttributesUpdated'),
            });
        } catch (error) {
            showToast({
                type: 'error',
                message:
                    error instanceof Error ? error.message : t('common.error'),
            });
        }
    };

    return (
        <div className={styles.form}>
            <div className={styles.fields}>
                {attributes.map((attribute) => (
                    <ProductVariantAttributeField
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
    );
};

export const ProductVariantAttributes = ({
    productId,
    variantId,
    productTypeId,
}: ProductVariantAttributesProps) => {
    const { t } = useTranslation();

    const {
        data: productType,
        isLoading: isProductTypeLoading,
        isError: isProductTypeError,
    } = useProductType(productTypeId ?? undefined);

    const {
        data: attributeData,
        isLoading: isAttributesLoading,
        isError: isAttributesError,
    } = useProductVariantAttributes(
        productId,
        variantId,
        Boolean(productTypeId),
    );

    const attributes = useMemo(
        () =>
            (productType?.attributes ?? [])
                .filter(
                    (attribute) =>
                        attribute.scope === 'VARIANT' ||
                        attribute.scope === 'BOTH',
                )
                .sort((first, second) => first.position - second.position),
        [productType?.attributes],
    );

    const existingValues = useMemo(() => {
        const values = new Map<string, AttributeValue>();

        for (const item of attributeData?.items ?? []) {
            values.set(item.attributeId, item.value);
        }

        return values;
    }, [attributeData?.items]);

    if (!productTypeId) {
        return null;
    }

    if (isProductTypeLoading || isAttributesLoading) {
        return (
            <section className={styles.section}>
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        {t('admin.products.variantAttributes')}
                    </h3>

                    <p className={styles.description}>
                        {t('admin.products.variantAttributesDescription')}
                    </p>
                </div>

                <p className={styles.loading}>{t('common.loading')}</p>
            </section>
        );
    }

    if (isProductTypeError || isAttributesError || !attributeData) {
        return (
            <section className={styles.section}>
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        {t('admin.products.variantAttributes')}
                    </h3>

                    <p className={styles.description}>
                        {t('admin.products.variantAttributesDescription')}
                    </p>
                </div>

                <p className={styles.error}>{t('common.error')}</p>
            </section>
        );
    }

    if (attributes.length === 0) {
        return null;
    }

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>
                        {t('admin.products.variantAttributes')}
                    </h3>

                    <p className={styles.description}>
                        {t('admin.products.variantAttributesDescription')}
                    </p>
                </div>
            </div>

            <ProductVariantAttributesForm
                key={`${variantId}:${attributeData.items
                    .map((item) => `${item.attributeId}:${item.value}`)
                    .join('|')}`}
                attributes={attributes}
                existingValues={existingValues}
                productId={productId}
                variantId={variantId}
            />
        </section>
    );
};
