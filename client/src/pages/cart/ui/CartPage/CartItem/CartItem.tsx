import { Minus, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import type { CartItem as CartItemType } from '@/entities/cart';
import {
    useRemoveCartItem,
    useUpdateCartItem,
} from '@/features/cart-item-actions';
import { formatCurrency } from '@/shared/lib/formatCurrency';

import styles from './CartItem.module.scss';

type CartItemProps = {
    item: CartItemType;
};

export const CartItem = ({ item }: CartItemProps) => {
    const { t } = useTranslation();

    const updateMutation = useUpdateCartItem();
    const removeMutation = useRemoveCartItem();

    const isUpdating = updateMutation.isPending || removeMutation.isPending;

    const maximumQuantity = Math.max(item.variant.stock, 1);

    const handleQuantityChange = (quantity: number) => {
        if (quantity < 1 || quantity > maximumQuantity || isUpdating) {
            return;
        }

        updateMutation.mutate({
            itemId: item.id,
            input: {
                quantity,
            },
        });
    };

    const handleRemove = () => {
        if (isUpdating) {
            return;
        }

        removeMutation.mutate(item.id);
    };

    const productImageAlt = item.product.image?.alt || item.product.name;

    return (
        <article className={styles.item}>
            <div className={styles.product}>
                {item.product.image ? (
                    <Link
                        to={`/product/${item.product.slug}`}
                        className={styles.imageLink}
                        aria-label={item.product.name}
                    >
                        <img
                            src={item.product.image.url}
                            alt={productImageAlt}
                            className={styles.image}
                            loading="lazy"
                        />
                    </Link>
                ) : (
                    <Link
                        to={`/product/${item.product.slug}`}
                        className={styles.imagePlaceholder}
                        aria-label={item.product.name}
                    >
                        <span>{item.product.name.charAt(0)}</span>
                    </Link>
                )}

                <div className={styles.info}>
                    <Link
                        to={`/product/${item.product.slug}`}
                        className={styles.name}
                    >
                        {item.product.name}
                    </Link>

                    <span className={styles.variant}>{item.variant.name}</span>

                    <span className={styles.sku}>
                        {t('cart.sku')}: {item.variant.sku}
                    </span>
                </div>
            </div>

            <div className={styles.price}>
                <span className={styles.priceLabel}>{t('cart.price')}</span>

                <strong>
                    {formatCurrency(item.variant.price ?? '0', 'RUB')}
                </strong>
            </div>

            <div className={styles.quantity}>
                <span className={styles.quantityLabel}>
                    {t('cart.quantity')}
                </span>

                <div className={styles.quantityControl}>
                    <button
                        type="button"
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        disabled={isUpdating || item.quantity <= 1}
                        aria-label={t('cart.decreaseQuantity')}
                    >
                        <Minus size={15} strokeWidth={2} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                        type="button"
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                        disabled={
                            isUpdating || item.quantity >= maximumQuantity
                        }
                        aria-label={t('cart.increaseQuantity')}
                    >
                        <Plus size={15} strokeWidth={2} />
                    </button>
                </div>
            </div>

            <div className={styles.subtotal}>
                <span className={styles.subtotalLabel}>
                    {t('cart.subtotal')}
                </span>

                <strong>{formatCurrency(item.subtotal, 'RUB')}</strong>
            </div>

            <button
                type="button"
                className={styles.remove}
                onClick={handleRemove}
                disabled={isUpdating}
                aria-label={t('cart.removeItem')}
                title={t('cart.removeItem')}
            >
                <Trash2 size={17} strokeWidth={1.8} />
            </button>
        </article>
    );
};
