import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import {
    useDeleteProductVariantPrice,
    useProductVariantPrices,
    useUpsertProductVariantPrice,
} from '../../../model';

import type { CurrencyCode } from '@/shared/config/currencies';

import styles from './ProductVariantPrices.module.scss';

const CURRENCIES: CurrencyCode[] = ['RUB', 'EUR', 'USD', 'GBP'];

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
    RUB: '₽',
    EUR: '€',
    USD: '$',
    GBP: '£',
};

type ProductVariantPricesProps = {
    productId: string;
    variantId: string;
};

export const ProductVariantPrices = ({
    productId,
    variantId,
}: ProductVariantPricesProps) => {
    const { t } = useTranslation();

    const { data, isLoading, isError } = useProductVariantPrices(
        productId,
        variantId,
    );

    const upsertPrice = useUpsertProductVariantPrice();

    const deletePrice = useDeleteProductVariantPrice();

    if (isLoading) {
        return (
            <section className={styles.card}>
                <h4 className={styles.title}>
                    {t('admin.products.variantPrices')}
                </h4>

                <p className={styles.muted}>{t('common.loading')}</p>
            </section>
        );
    }

    if (isError || !data) {
        return (
            <section className={styles.card}>
                <h4 className={styles.title}>
                    {t('admin.products.variantPrices')}
                </h4>

                <p className={styles.error}>{t('common.error')}</p>
            </section>
        );
    }

    const pricesByCurrency = new Map(
        data.items.map((price) => [price.currency, price]),
    );

    return (
        <section className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h4 className={styles.title}>
                        {t('admin.products.variantPrices')}
                    </h4>

                    <p className={styles.description}>
                        {t('admin.products.variantPricesDescription')}
                    </p>
                </div>
            </div>

            <div className={styles.list}>
                {CURRENCIES.map((currency) => {
                    const price = pricesByCurrency.get(currency);

                    return (
                        <VariantPriceRow
                            key={currency}
                            currency={currency}
                            amount={price?.amount ?? ''}
                            symbol={CURRENCY_SYMBOLS[currency]}
                            isDefault={currency === 'RUB'}
                            isSaving={upsertPrice.isPending}
                            isDeleting={deletePrice.isPending}
                            onSave={(amount) =>
                                upsertPrice
                                    .mutateAsync({
                                        productId,
                                        variantId,
                                        currency,
                                        input: {
                                            amount,
                                        },
                                    })
                                    .then(() => undefined)
                            }
                            onDelete={() =>
                                deletePrice
                                    .mutateAsync({
                                        productId,
                                        variantId,
                                        currency,
                                    })
                                    .then(() => undefined)
                            }
                        />
                    );
                })}
            </div>
        </section>
    );
};

type VariantPriceRowProps = {
    currency: CurrencyCode;
    amount: string;
    symbol: string;
    isDefault: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    onSave: (amount: number) => Promise<void>;
    onDelete: () => Promise<void>;
};

const VariantPriceRow = ({
    currency,
    amount,
    symbol,
    isDefault,
    isSaving,
    isDeleting,
    onSave,
    onDelete,
}: VariantPriceRowProps) => {
    const { t } = useTranslation();

    const [value, setValue] = useState(amount);

    const handleSave = async () => {
        const parsedValue = Number(value);

        if (!Number.isFinite(parsedValue) || parsedValue < 0) {
            return;
        }

        await onSave(parsedValue);
    };

    const handleDelete = async () => {
        if (isDefault) {
            return;
        }

        await onDelete();
    };

    return (
        <div className={styles.row}>
            <div className={styles.currency}>
                <span className={styles.symbol}>{symbol}</span>

                <div className={styles.currencyInfo}>
                    <strong>{currency}</strong>

                    {isDefault && (
                        <span className={styles.default}>
                            {t('admin.products.defaultCurrency')}
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.inputWrapper}>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        disabled={isSaving || isDeleting}
                        className={styles.input}
                    />

                    <span>{symbol}</span>
                </div>

                <button
                    type="button"
                    className={styles.saveButton}
                    disabled={isSaving || isDeleting || !value.trim()}
                    onClick={handleSave}
                >
                    {isSaving ? t('common.saving') : t('common.save')}
                </button>

                {!isDefault && (
                    <button
                        type="button"
                        className={styles.deleteButton}
                        disabled={isSaving || isDeleting}
                        onClick={handleDelete}
                    >
                        {t('common.delete')}
                    </button>
                )}
            </div>
        </div>
    );
};
