import { useTranslation } from 'react-i18next';

import type { AddCartItemInput } from '@/entities/cart';

import { useAddToCart } from '../../model/useAddToCart';

import styles from './AddToCartButton.module.scss';

type AddToCartButtonProps = {
    productId: string;
    variantId: string | null;
    quantity: number;
    disabled?: boolean;
};

export const AddToCartButton = ({
    productId,
    variantId,
    quantity,
    disabled = false,
}: AddToCartButtonProps) => {
    const { t } = useTranslation();
    const mutation = useAddToCart();

    const isDisabled =
        disabled || !variantId || quantity < 1 || mutation.isPending;

    const handleClick = () => {
        if (!variantId || quantity < 1 || mutation.isPending) {
            return;
        }

        const input: AddCartItemInput = {
            productId,
            variantId,
            quantity,
        };

        mutation.mutate(input);
    };

    return (
        <button
            type="button"
            className={styles.button}
            disabled={isDisabled}
            onClick={handleClick}
        >
            {mutation.isPending
                ? t('product.purchase.addingToCart')
                : mutation.isSuccess
                  ? t('product.purchase.addedToCart')
                  : t('product.purchase.addToCart')}
        </button>
    );
};
