import { useTranslation } from 'react-i18next';

import type {
    AdminOrderAddress,
    AdminOrderCustomer,
} from '@/features/admin/orders';

import styles from '../AdminOrderPage.module.scss';

interface AdminOrderCustomerCardProps {
    customer: AdminOrderCustomer;
    address: AdminOrderAddress;
}

export const AdminOrderCustomerCard = ({
    customer,
    address,
}: AdminOrderCustomerCardProps) => {
    const { t } = useTranslation();

    const customerName =
        [customer.firstName, customer.lastName]
            .filter((value): value is string => Boolean(value?.trim()))
            .join(' ')
            .trim() || customer.name;

    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                    {t('admin.orders.details.customer')}
                </h2>
            </div>

            <div className={styles.customerDetails}>
                <div className={styles.customerMain}>
                    <div className={styles.avatar}>
                        {customerName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <strong className={styles.customerName}>
                            {customerName}
                        </strong>

                        <a
                            href={`mailto:${customer.email}`}
                            className={styles.customerEmail}
                        >
                            {customer.email}
                        </a>
                    </div>
                </div>
            </div>

            <div className={styles.sectionDivider} />

            <div>
                <h3 className={styles.subsectionTitle}>
                    {t('admin.orders.details.shippingAddress')}
                </h3>

                <address className={styles.address}>
                    <strong>
                        {address.firstName} {address.lastName}
                    </strong>

                    <span>{address.phone}</span>

                    <span>
                        {address.country}, {address.city}
                    </span>

                    <span>{address.postalCode}</span>

                    <span>
                        {address.street}
                        {address.apartment ? `, ${address.apartment}` : ''}
                    </span>
                </address>
            </div>
        </section>
    );
};
