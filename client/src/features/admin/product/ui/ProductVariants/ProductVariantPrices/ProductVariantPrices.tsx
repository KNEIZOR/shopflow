import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    useDeleteProductVariantPrice,
    useProductVariantPrices,
    useUpsertProductVariantPrice,
} from '../../../model';

import { CURRENCIES, type CurrencyCode } from '@/shared/config/currencies';
import { useToast } from '@/shared/ui/Toast';

import styles from './ProductVariantPrices.module.scss';

type ProductVariantPricesProps = {
    productId: string;
    variantId: string;
};

export const ProductVariantPrices = ({
    productId,
    variantId,
}: ProductVariantPricesProps) => {
    const { t } = useTranslation();
    const { showToast } = useToast();

    const { data, isLoading, isError } = useProductVariantPrices(
        productId,
        variantId,
    );

    const upsertPrice = useUpsertProductVariantPrice();
    const deletePrice = useDeleteProductVariantPrice();

    if (isLoading) {
        return (
            <section className={styles.card}>
                <h3 className={styles.title}>
                    {t('admin.products.variantPrices')}
                </h3>

                <p className={styles.muted}>{t('common.loading')}</p>
            </section>
        );
    }

    if (isError || !data) {
        return (
            <section className={styles.card}>
                <h3 className={styles.title}>
                    {t('admin.products.variantPrices')}
                </h3>

                <p className={styles.error}>{t('common.error')}</p>
            </section>
        );
    }

    const pricesByCurrency = new Map(
        data.items.map((price) => [price.currency, price]),
    );

    const handleSave = async (
        currency: CurrencyCode,
        amount: string,
    ): Promise<void> => {
        const trimmedAmount = amount.trim();

        if (!trimmedAmount) {
            return;
        }

        const parsedAmount = Number(trimmedAmount);

        if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
            showToast({
                type: 'error',
                message: t('admin.products.invalidPrice'),
            });

            return;
        }

        try {
            await upsertPrice.mutateAsync({
                productId,
                variantId,
                currency,
                input: {
                    amount: parsedAmount,
                },
            });

            showToast({
                type: 'success',
                message: t('admin.products.priceUpdated'),
            });
        } catch (error) {
            showToast({
                type: 'error',
                message:
                    error instanceof Error ? error.message : t('common.error'),
            });
        }
    };

    const handleDelete = async (currency: CurrencyCode): Promise<void> => {
        if (currency === 'RUB') {
            return;
        }

        try {
            await deletePrice.mutateAsync({
                productId,
                variantId,
                currency,
            });

            showToast({
                type: 'success',
                message: t('admin.products.priceDeleted'),
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
        <section className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>
                        {t('admin.products.variantPrices')}
                    </h3>

                    <p className={styles.description}>
                        {t('admin.products.variantPricesDescription')}
                    </p>
                </div>
            </div>

            <div className={styles.list}>
                {CURRENCIES.map(({ code: currency, symbol }) => {
                    const price = pricesByCurrency.get(currency);

                    return (
                        <PriceRow
                            key={`${currency}-${price?.amount ?? 'empty'}`}
                            currency={currency}
                            amount={price?.amount ?? ''}
                            symbol={symbol}
                            isDefault={currency === 'RUB'}
                            isSaving={upsertPrice.isPending}
                            isDeleting={deletePrice.isPending}
                            onSave={(amount) => handleSave(currency, amount)}
                            onDelete={() => handleDelete(currency)}
                        />
                    );
                })}
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

    const hasValue = value.trim().length > 0;

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
                        disabled={isSaving || isDeleting}
                        className={styles.input}
                        autoComplete="off"
                    />

                    <span>{symbol}</span>
                </div>

                <button
                    type="button"
                    className={styles.saveButton}
                    disabled={isSaving || isDeleting || !hasValue}
                    onClick={handleSave}
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
        </div>
    );
};
