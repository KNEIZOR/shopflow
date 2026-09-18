import type {
    ProductAttributeType,
    ProductTypeAttribute,
} from '@/entities/product-type';
import { useTranslation } from 'react-i18next';

import styles from './ProductAttributes.module.scss';

type ProductAttributeFieldProps = {
    attribute: ProductTypeAttribute;
    value: string | number | boolean | undefined;
    disabled: boolean;
    onChange: (value: string | number | boolean | undefined) => void;
};

const getInputValue = (
    type: ProductAttributeType,
    value: string | number | boolean | undefined,
): string | number => {
    if (value === undefined) {
        return '';
    }

    if (type === 'NUMBER') {
        return typeof value === 'number' ? value : Number(value);
    }

    if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }

    return value;
};

const getTypeLabelKey = (type: ProductAttributeType): string => {
    switch (type) {
        case 'TEXT':
            return 'text';

        case 'NUMBER':
            return 'number';

        case 'BOOLEAN':
            return 'boolean';

        case 'SELECT':
            return 'select';

        default:
            return 'text';
    }
};

export const ProductAttributeField = ({
    attribute,
    value,
    disabled,
    onChange,
}: ProductAttributeFieldProps) => {
    const { t } = useTranslation();

    const inputValue = getInputValue(attribute.type, value);

    const typeLabel = t(
        `admin.products.attributes.types.${getTypeLabelKey(attribute.type)}`,
    );

    if (attribute.type === 'BOOLEAN') {
        return (
            <div className={`${styles.attributeCard} ${styles.booleanCard}`}>
                <div className={styles.attributeHeader}>
                    <div className={styles.attributeTitleBlock}>
                        <span className={styles.label}>
                            {attribute.name}

                            {attribute.isRequired && (
                                <span className={styles.required}>*</span>
                            )}
                        </span>

                        <span className={styles.typeBadge}>{typeLabel}</span>
                    </div>
                </div>

                {attribute.description && (
                    <p className={styles.attributeDescription}>
                        {attribute.description}
                    </p>
                )}

                <label
                    className={`${styles.switchRow} ${
                        disabled ? styles.disabled : ''
                    }`}
                >
                    <span className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={value === true}
                            disabled={disabled}
                            onChange={(event) => onChange(event.target.checked)}
                        />

                        <span className={styles.slider} />
                    </span>

                    <span className={styles.switchLabel}>
                        {value === true
                            ? t('common.enabled')
                            : t('common.disabled')}
                    </span>
                </label>
            </div>
        );
    }

    return (
        <div className={styles.attributeCard}>
            <div className={styles.attributeHeader}>
                <div className={styles.attributeTitleBlock}>
                    <span className={styles.label}>
                        {attribute.name}

                        {attribute.isRequired && (
                            <span className={styles.required}>*</span>
                        )}
                    </span>

                    <span className={styles.typeBadge}>{typeLabel}</span>
                </div>
            </div>

            {attribute.description && (
                <p className={styles.attributeDescription}>
                    {attribute.description}
                </p>
            )}

            <div className={styles.inputWrapper}>
                {attribute.type === 'SELECT' ? (
                    <select
                        className={styles.input}
                        value={String(inputValue)}
                        disabled={disabled}
                        onChange={(event) =>
                            onChange(event.target.value || undefined)
                        }
                    >
                        <option value="">
                            {t('admin.products.attributes.selectPlaceholder')}
                        </option>

                        {attribute.options.map((option) => (
                            <option key={option.id} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        className={styles.input}
                        type={attribute.type === 'NUMBER' ? 'number' : 'text'}
                        value={inputValue}
                        disabled={disabled}
                        placeholder={
                            attribute.type === 'NUMBER' ? '0' : undefined
                        }
                        onChange={(event) => {
                            const rawValue = event.target.value;

                            if (attribute.type === 'NUMBER') {
                                if (!rawValue) {
                                    onChange(undefined);

                                    return;
                                }

                                const numericValue = Number(rawValue);

                                onChange(
                                    Number.isFinite(numericValue)
                                        ? numericValue
                                        : undefined,
                                );

                                return;
                            }

                            onChange(rawValue);
                        }}
                    />
                )}
            </div>
        </div>
    );
};
