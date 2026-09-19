import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';

import { useAddresses } from '@/entities/address';
import { useAuth } from '@/entities/auth';
import { useCart } from '@/entities/cart';
import { useLocale } from '@/entities/locale';

import { useCheckout } from '@/features/checkout/model/useCheckout';

import { AddressForm } from '@/features/checkout/ui/AddressForm/AddressForm';
import { AddressSelector } from '@/features/checkout/ui/AddressSelector/AddressSelector';
import { CheckoutItems } from '@/features/checkout/ui/CheckoutItems/CheckoutItems';
import { CheckoutSummary } from '@/features/checkout/ui/CheckoutSummary/CheckoutSummary';

import styles from './CheckoutPage.module.scss';

export const CheckoutPage = () => {
    const { t } = useTranslation();

    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const { currency } = useLocale();

    const cartQuery = useCart();
    const addressesQuery = useAddresses();
    const checkoutMutation = useCheckout();

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
        null,
    );

    const [isAddingAddress, setIsAddingAddress] = useState(false);

    const addresses = addressesQuery.data ?? [];
    const cart = cartQuery.data ?? null;

    const selectedAddressExists = selectedAddressId
        ? addresses.some((address) => address.id === selectedAddressId)
        : false;

    const effectiveSelectedAddressId = selectedAddressExists
        ? selectedAddressId
        : (addresses[0]?.id ?? null);

    if (isAuthLoading) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.state}>
                        <span className={styles.stateEyebrow}>
                            {t('checkout.eyebrow')}
                        </span>

                        <h1>{t('checkout.loading')}</h1>

                        <p>{t('checkout.loadingDescription')}</p>
                    </div>
                </div>
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/account/login"
                replace
                state={{
                    from: '/checkout',
                }}
            />
        );
    }

    if (cartQuery.isLoading || addressesQuery.isLoading) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.state}>
                        <span className={styles.stateEyebrow}>
                            {t('checkout.eyebrow')}
                        </span>

                        <h1>{t('checkout.loading')}</h1>

                        <p>{t('checkout.loadingDescription')}</p>
                    </div>
                </div>
            </main>
        );
    }

    if (cartQuery.isError || !cart) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.state}>
                        <span className={styles.stateEyebrow}>
                            {t('checkout.eyebrow')}
                        </span>

                        <h1>{t('checkout.cartErrorTitle')}</h1>

                        <p>{t('checkout.cartErrorDescription')}</p>

                        <Link to="/cart" className={styles.stateButton}>
                            {t('checkout.backToCart')}
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (cart.items.length === 0) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.state}>
                        <span className={styles.stateEyebrow}>
                            {t('checkout.eyebrow')}
                        </span>

                        <h1>{t('checkout.emptyTitle')}</h1>

                        <p>{t('checkout.emptyDescription')}</p>

                        <Link to="/catalog" className={styles.stateButton}>
                            {t('checkout.backToCatalog')}
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (addressesQuery.isError) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.state}>
                        <span className={styles.stateEyebrow}>
                            {t('checkout.eyebrow')}
                        </span>

                        <h1>{t('checkout.addressErrorTitle')}</h1>

                        <p>{t('checkout.addressErrorDescription')}</p>

                        <button
                            type="button"
                            className={styles.stateButton}
                            onClick={() => void addressesQuery.refetch()}
                        >
                            {t('checkout.retry')}
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    const canCheckout =
        Boolean(effectiveSelectedAddressId) &&
        !checkoutMutation.isPending &&
        cart.items.length > 0;

    const handleCreateAddress = (addressId: string) => {
        setSelectedAddressId(addressId);
        setIsAddingAddress(false);
    };

    const handleAddressSelect = (addressId: string) => {
        setSelectedAddressId(addressId);
    };

    const handleCheckout = () => {
        if (!effectiveSelectedAddressId || checkoutMutation.isPending) {
            return;
        }

        checkoutMutation.mutate(
            {
                addressId: effectiveSelectedAddressId,
                currency,
            },
            {
                onSuccess: (result) => {
                    window.location.assign(result.checkoutUrl);
                },
            },
        );
    };

    return (
        <main className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div>
                        <span className={styles.eyebrow}>
                            {t('checkout.eyebrow')}
                        </span>

                        <h1 className={styles.title}>{t('checkout.title')}</h1>

                        <p className={styles.description}>
                            {t('checkout.description')}
                        </p>
                    </div>

                    <Link to="/cart" className={styles.backLink}>
                        {t('checkout.backToCart')}
                    </Link>
                </header>

                {checkoutMutation.isError && (
                    <div className={styles.checkoutError}>
                        <strong>{t('checkout.paymentErrorTitle')}</strong>

                        <p>
                            {checkoutMutation.error instanceof Error
                                ? checkoutMutation.error.message
                                : t('checkout.paymentErrorDescription')}
                        </p>
                    </div>
                )}

                <div className={styles.layout}>
                    <div className={styles.main}>
                        {isAddingAddress ? (
                            <AddressForm
                                onCreated={handleCreateAddress}
                                onCancel={() => setIsAddingAddress(false)}
                            />
                        ) : (
                            <AddressSelector
                                addresses={addresses}
                                selectedAddressId={effectiveSelectedAddressId}
                                onSelect={handleAddressSelect}
                                onAddAddress={() => setIsAddingAddress(true)}
                                disabled={checkoutMutation.isPending}
                            />
                        )}

                        <CheckoutItems items={cart.items} currency={currency} />
                    </div>

                    <div className={styles.sidebar}>
                        <CheckoutSummary
                            summary={cart.summary}
                            canCheckout={canCheckout}
                            isPending={checkoutMutation.isPending}
                            onCheckout={handleCheckout}
                        />

                        {!effectiveSelectedAddressId && (
                            <p className={styles.addressHint}>
                                {t('checkout.selectAddressHint')}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};
