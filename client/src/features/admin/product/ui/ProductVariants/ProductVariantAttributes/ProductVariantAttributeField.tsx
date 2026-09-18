import type {
    ProductAttributeType,
    ProductTypeAttribute,
} from '@/entities/product-type';

import styles from './ProductVariantAttributes.module.scss';

type ProductVariantAttributeFieldProps = {
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

export const ProductVariantAttributeField = ({
    attribute,
    value,
    disabled,
    onChange,
}: ProductVariantAttributeFieldProps) => {
    const inputValue = getInputValue(attribute.type, value);

    if (attribute.type === 'BOOLEAN') {
        return (
            <label className={styles.checkboxField}>
                <input
                    type="checkbox"
                    checked={value === true}
                    disabled={disabled}
                    onChange={(event) => onChange(event.target.checked)}
                />

                <span>
                    {attribute.name}

                    {attribute.isRequired && (
                        <span className={styles.required}>*</span>
                    )}
                </span>
            </label>
        );
    }

    return (
        <label className={styles.field}>
            <span className={styles.label}>
                {attribute.name}

                {attribute.isRequired && (
                    <span className={styles.required}>*</span>
                )}
            </span>

            {attribute.description && (
                <span className={styles.description}>
                    {attribute.description}
                </span>
            )}

            {attribute.type === 'SELECT' ? (
                <select
                    value={String(inputValue)}
                    disabled={disabled}
                    onChange={(event) =>
                        onChange(event.target.value || undefined)
                    }
                >
                    <option value="">—</option>

                    {attribute.options.map((option) => (
                        <option key={option.id} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={attribute.type === 'NUMBER' ? 'number' : 'text'}
                    value={inputValue}
                    disabled={disabled}
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
        </label>
    );
};
