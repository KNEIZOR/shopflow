import { useTranslation } from 'react-i18next';

import type { Address } from '@/entities/address';

import styles from './AddressSelector.module.scss';

type AddressSelectorProps = {
    addresses: Address[];
    selectedAddressId: string | null;
    onSelect: (addressId: string) => void;
    onAddAddress: () => void;
    disabled?: boolean;
};

export const AddressSelector = ({
    addresses,
    selectedAddressId,
    onSelect,
    onAddAddress,
    disabled = false,
}: AddressSelectorProps) => {
    const { t } = useTranslation();

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>
                        {t('checkout.deliveryLabel')}
                    </span>

                    <h2 className={styles.title}>
                        {t('checkout.deliveryAddress')}
                    </h2>
                </div>

                <span className={styles.count}>
                    {t('checkout.addressCount', {
                        count: addresses.length,
                    })}
                </span>
            </div>

            {addresses.length > 0 ? (
                <div className={styles.list}>
                    {addresses.map((address) => {
                        const isSelected = address.id === selectedAddressId;

                        return (
                            <button
                                key={address.id}
                                type="button"
                                className={`${styles.address} ${
                                    isSelected ? styles.addressSelected : ''
                                }`}
                                onClick={() => onSelect(address.id)}
                                disabled={disabled}
                            >
                                <span
                                    className={`${styles.radio} ${
                                        isSelected ? styles.radioSelected : ''
                                    }`}
                                >
                                    {isSelected && (
                                        <span className={styles.radioDot} />
                                    )}
                                </span>

                                <span className={styles.content}>
                                    <strong>
                                        {address.firstName} {address.lastName}
                                    </strong>

                                    <span>
                                        {address.country}, {address.city}
                                    </span>

                                    <span>
                                        {address.street}
                                        {address.apartment
                                            ? `, ${address.apartment}`
                                            : ''}
                                    </span>

                                    <span>
                                        {address.postalCode} · {address.phone}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className={styles.empty}>
                    <p>{t('checkout.noAddresses')}</p>
                </div>
            )}

            <button
                type="button"
                className={styles.addButton}
                onClick={onAddAddress}
                disabled={disabled}
            >
                <span>+</span>
                {t('checkout.addAddress')}
            </button>
        </section>
    );
};
