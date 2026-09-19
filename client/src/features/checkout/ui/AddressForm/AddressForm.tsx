import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateAddress } from '../../model/useCreateAddress';

import styles from './AddressForm.module.scss';

type AddressFormProps = {
    onCreated: (addressId: string) => void;
    onCancel: () => void;
};

type FormState = {
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    city: string;
    postalCode: string;
    street: string;
    apartment: string;
};

const INITIAL_FORM: FormState = {
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    city: '',
    postalCode: '',
    street: '',
    apartment: '',
};

export const AddressForm = ({ onCreated, onCancel }: AddressFormProps) => {
    const { t } = useTranslation();

    const createMutation = useCreateAddress();

    const [form, setForm] = useState<FormState>(INITIAL_FORM);

    const handleChange = (field: keyof FormState, value: string) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (createMutation.isPending) {
            return;
        }

        createMutation.mutate(
            {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                phone: form.phone.trim(),
                country: form.country.trim(),
                city: form.city.trim(),
                postalCode: form.postalCode.trim(),
                street: form.street.trim(),
                apartment: form.apartment.trim() || undefined,
            },
            {
                onSuccess: (address) => {
                    setForm(INITIAL_FORM);
                    onCreated(address.id);
                },
            },
        );
    };

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>
                        {t('checkout.newAddressLabel')}
                    </span>

                    <h2 className={styles.title}>
                        {t('checkout.addDeliveryAddress')}
                    </h2>
                </div>

                <button
                    type="button"
                    className={styles.cancel}
                    onClick={onCancel}
                    disabled={createMutation.isPending}
                >
                    {t('checkout.cancel')}
                </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.grid}>
                    <label className={styles.field}>
                        <span>{t('checkout.firstName')}</span>

                        <input
                            value={form.firstName}
                            onChange={(event) =>
                                handleChange('firstName', event.target.value)
                            }
                            required
                            maxLength={100}
                            autoComplete="given-name"
                        />
                    </label>

                    <label className={styles.field}>
                        <span>{t('checkout.lastName')}</span>

                        <input
                            value={form.lastName}
                            onChange={(event) =>
                                handleChange('lastName', event.target.value)
                            }
                            required
                            maxLength={100}
                            autoComplete="family-name"
                        />
                    </label>

                    <label className={styles.field}>
                        <span>{t('checkout.phone')}</span>

                        <input
                            value={form.phone}
                            onChange={(event) =>
                                handleChange('phone', event.target.value)
                            }
                            required
                            maxLength={30}
                            autoComplete="tel"
                        />
                    </label>

                    <label className={styles.field}>
                        <span>{t('checkout.country')}</span>

                        <input
                            value={form.country}
                            onChange={(event) =>
                                handleChange('country', event.target.value)
                            }
                            required
                            maxLength={100}
                            autoComplete="country-name"
                        />
                    </label>

                    <label className={styles.field}>
                        <span>{t('checkout.city')}</span>

                        <input
                            value={form.city}
                            onChange={(event) =>
                                handleChange('city', event.target.value)
                            }
                            required
                            maxLength={100}
                            autoComplete="address-level2"
                        />
                    </label>

                    <label className={styles.field}>
                        <span>{t('checkout.postalCode')}</span>

                        <input
                            value={form.postalCode}
                            onChange={(event) =>
                                handleChange('postalCode', event.target.value)
                            }
                            required
                            maxLength={20}
                            autoComplete="postal-code"
                        />
                    </label>

                    <label className={`${styles.field} ${styles.full}`}>
                        <span>{t('checkout.street')}</span>

                        <input
                            value={form.street}
                            onChange={(event) =>
                                handleChange('street', event.target.value)
                            }
                            required
                            maxLength={200}
                            autoComplete="street-address"
                        />
                    </label>

                    <label className={styles.field}>
                        <span>{t('checkout.apartment')}</span>

                        <input
                            value={form.apartment}
                            onChange={(event) =>
                                handleChange('apartment', event.target.value)
                            }
                            maxLength={50}
                            autoComplete="address-line2"
                        />
                    </label>
                </div>

                {createMutation.isError && (
                    <p className={styles.error}>
                        {createMutation.error instanceof Error
                            ? createMutation.error.message
                            : t('checkout.addressCreateError')}
                    </p>
                )}

                <button
                    type="submit"
                    className={styles.submit}
                    disabled={createMutation.isPending}
                >
                    {createMutation.isPending
                        ? t('checkout.savingAddress')
                        : t('checkout.saveAddress')}
                </button>
            </form>
        </section>
    );
};
