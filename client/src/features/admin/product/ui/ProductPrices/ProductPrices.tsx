import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
    useDeleteProductPrice,
    useProductPrices,
    useUpsertProductPrice,
} from '../../model';

import type { CurrencyCode } from '@/shared/config/currencies';

import styles from './ProductPrices.module.scss';

const CURRENCIES: CurrencyCode[] = ['RUB', 'EUR', 'USD', 'GBP'];

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
    RUB: '₽',
    EUR: '€',
    USD: '$',
    GBP: '£',
};

type ProductPricesProps = {
    productId: string;
};

export const ProductPrices = ({ productId }: ProductPricesProps) => {
    const { t } = useTranslation();

    const { data, isLoading, isError } = useProductPrices(productId);

    const upsertPrice = useUpsertProductPrice();

    const deletePrice = useDeleteProductPrice();

    if (isLoading) {
        return (
            <section className={styles.card}>
                <h2 className={styles.title}>{t('admin.products.prices')}</h2>

                <p className={styles.muted}>{t('common.loading')}</p>
            </section>
        );
    }

    if (isError || !data) {
        return (
            <section className={styles.card}>
                <h2 className={styles.title}>{t('admin.products.prices')}</h2>

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
                    <h2 className={styles.title}>
                        {t('admin.products.prices')}
                    </h2>

                    <p className={styles.description}>
                        {t('admin.products.pricesDescription')}
                    </p>
                </div>
            </div>

            <div className={styles.list}>
                {CURRENCIES.map((currency) => (
                    <PriceRow
                        key={currency}
                        currency={currency}
                        amount={pricesByCurrency.get(currency)?.amount ?? ''}
                        symbol={CURRENCY_SYMBOLS[currency]}
                        isDefault={currency === 'RUB'}
                        isSaving={upsertPrice.isPending}
                        isDeleting={deletePrice.isPending}
                        onSave={async (amount) => {
                            const value = Number(amount);

                            if (!Number.isFinite(value) || value < 0) {
                                return;
                            }

                            await upsertPrice.mutateAsync({
                                productId,
                                currency,
                                input: {
                                    amount: value,
                                },
                            });
                        }}
                        onDelete={async () => {
                            if (currency === 'RUB') {
                                return;
                            }

                            await deletePrice.mutateAsync({
                                productId,
                                currency,
                            });
                        }}
                    />
                ))}
            </div>
        </section>
    );
};

type PriceRowProps = {
    currency: CurrencyCode;
    amount: string;
    symbol: string;
    isDefault: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    onSave: (amount: string) => Promise<void>;
    onDelete: () => Promise<void>;
};

const PriceRow = ({
    currency,
    amount,
    symbol,
    isDefault,
    isSaving,
    isDeleting,
    onSave,
    onDelete,
}: PriceRowProps) => {
    const { t } = useTranslation();

    const [value, setValue] = useState(amount);

    const handleSave = async () => {
        await onSave(value);
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
                        className={styles.input}
                    />

                    <span>{symbol}</span>
                </div>

                <button
                    type="button"
                    className={styles.saveButton}
                    disabled={isSaving || isDeleting}
                    onClick={handleSave}
                >
                    {t('common.save')}
                </button>

                {!isDefault && (
                    <button
                        type="button"
                        className={styles.deleteButton}
                        disabled={isSaving || isDeleting || !value}
                        onClick={onDelete}
                    >
                        {t('common.delete')}
                    </button>
                )}
            </div>
        </div>
    );
};
