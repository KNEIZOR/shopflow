import { useTranslation } from 'react-i18next';

import type { Product } from '@/entities/product';

import styles from './ProductAttributes.module.scss';

type ProductAttributesProps = {
    product: Product;
};

const formatAttributeValue = (value: string, type: string) => {
    if (type === 'BOOLEAN') {
        return value === 'true' ? 'Yes' : 'No';
    }

    return value;
};

export const ProductAttributes = ({ product }: ProductAttributesProps) => {
    const { t } = useTranslation();

    if (product.attributes.length === 0) {
        return null;
    }

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <p className={styles.eyebrow}>{t('product.specifications')}</p>

                <h2 className={styles.title}>{t('product.characteristics')}</h2>
            </div>

            <div className={styles.list}>
                {product.attributes.map((item) => (
                    <div className={styles.row} key={item.id}>
                        <div className={styles.name}>
                            <span>{item.attribute.name}</span>

                            {item.attribute.description && (
                                <small>{item.attribute.description}</small>
                            )}
                        </div>

                        <strong>
                            {formatAttributeValue(
                                item.value,
                                item.attribute.type,
                            )}
                        </strong>
                    </div>
                ))}
            </div>
        </section>
    );
};
