import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/entities/auth';
import { useAddToCart } from '@/features/add-to-cart';
import type { Product, ProductVariant } from '@/entities/product';
import { formatCurrency } from '@/shared/lib/formatCurrency';

import styles from './ProductPurchase.module.scss';

type ProductPurchaseProps = {
    product: Product;
    selectedVariant: ProductVariant | null;
    selectedVariantId: string | null;
    quantity: number;
    price: string;
    currency: Product['currency'];
    stock: number | null;
    hasStock: boolean;
    onVariantChange: (variantId: string) => void;
    onQuantityChange: (quantity: number) => void;
};

export const ProductPurchase = ({
    product,
    selectedVariant,
    selectedVariantId,
    quantity,
    price,
    currency,
    stock,
    hasStock,
    onVariantChange,
    onQuantityChange,
}: ProductPurchaseProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const addToCartMutation = useAddToCart();

    const hasVariants = product.variants.length > 0;
    const maximumQuantity = stock ?? 99;

    const isAddingToCart = addToCartMutation.isPending;
    const isAddedToCart = addToCartMutation.isSuccess;

    const canAddToCart =
        Boolean(selectedVariant) &&
        hasStock &&
        quantity >= 1 &&
        !isAddingToCart &&
        !isAuthLoading;

    const handleDecrease = () => {
        onQuantityChange(quantity - 1);
    };

    const handleIncrease = () => {
        onQuantityChange(quantity + 1);
    };

    const handleAddToCart = () => {
        if (!selectedVariant || !canAddToCart) {
            return;
        }

        if (!isAuthenticated) {
            void navigate('/account/login', {
                state: {
                    from: location.pathname + location.search,
                },
            });

            return;
        }

        addToCartMutation.mutate({
            productId: product.id,
            variantId: selectedVariant.id,
            quantity,
        });
    };

    const getAddToCartLabel = () => {
        if (isAddingToCart) {
            return t('product.addingToCart');
        }

        if (isAddedToCart) {
            return t('product.addedToCart');
        }

        return t('product.addToCart');
    };

    const addToCartLabel = getAddToCartLabel();

    return (
        <aside className={styles.purchase}>
            <div className={styles.header}>
                <div className={styles.meta}>
                    <Link
                        to={`/catalog?category=${product.category.slug}`}
                        className={styles.category}
                    >
                        {product.category.name}
                    </Link>

                    {product.productType && (
                        <span className={styles.productType}>
                            {product.productType.name}
                        </span>
                    )}
                </div>

                <h1 className={styles.title}>{product.name}</h1>

                {product.description && (
                    <p className={styles.description}>{product.description}</p>
                )}
            </div>

            <div className={styles.priceArea}>
                <span className={styles.priceLabel}>{t('product.price')}</span>

                <strong className={styles.price}>
                    {formatCurrency(price, currency)}
                </strong>

                <div
                    className={`${styles.stock} ${
                        hasStock
                            ? styles.stockAvailable
                            : styles.stockUnavailable
                    }`}
                >
                    <span className={styles.stockDot} />

                    <span>
                        {hasStock
                            ? stock !== null
                                ? t('product.stockAvailable', {
                                      count: stock,
                                  })
                                : t('product.inStock')
                            : t('product.outOfStock')}
                    </span>
                </div>
            </div>

            {hasVariants && (
                <section className={styles.variants}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <span className={styles.sectionLabel}>
                                {t('product.configuration')}
                            </span>

                            <h2 className={styles.sectionTitle}>
                                {t('product.availableVariants')}
                            </h2>
                        </div>

                        <span className={styles.variantCount}>
                            {t('product.variantCount', {
                                count: product.variants.length,
                            })}
                        </span>
                    </div>

                    <div className={styles.variantGrid}>
                        {product.variants.map((variant) => {
                            const isSelected = variant.id === selectedVariantId;
                            const isAvailable = variant.stock > 0;

                            return (
                                <button
                                    key={variant.id}
                                    type="button"
                                    className={`${styles.variantButton} ${
                                        isSelected
                                            ? styles.variantButtonActive
                                            : ''
                                    } ${
                                        !isAvailable
                                            ? styles.variantButtonDisabled
                                            : ''
                                    }`}
                                    disabled={!isAvailable}
                                    onClick={() => onVariantChange(variant.id)}
                                >
                                    <span className={styles.variantName}>
                                        {variant.name}
                                    </span>

                                    <span className={styles.variantPrice}>
                                        {formatCurrency(
                                            variant.price ?? product.price,
                                            variant.currency ??
                                                product.currency,
                                        )}
                                    </span>

                                    <span className={styles.variantStock}>
                                        {isAvailable
                                            ? t('product.stockAvailable', {
                                                  count: variant.stock,
                                              })
                                            : t('product.stockUnavailable')}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>
            )}

            <div className={styles.details}>
                <div className={styles.detail}>
                    <span>{t('product.category')}</span>

                    <Link to={`/catalog?category=${product.category.slug}`}>
                        {product.category.name}
                    </Link>
                </div>

                {product.productType && (
                    <div className={styles.detail}>
                        <span>{t('product.productType')}</span>

                        <strong>{product.productType.name}</strong>
                    </div>
                )}

                {selectedVariant && (
                    <div className={styles.detail}>
                        <span>{t('product.sku')}</span>

                        <code>{selectedVariant.sku}</code>
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <div className={styles.quantity}>
                    <span className={styles.quantityLabel}>
                        {t('product.quantity')}
                    </span>

                    <div className={styles.quantityControl}>
                        <button
                            type="button"
                            onClick={handleDecrease}
                            disabled={!hasStock || quantity <= 1}
                            aria-label={t('product.decreaseQuantity')}
                        >
                            −
                        </button>

                        <span>{quantity}</span>

                        <button
                            type="button"
                            onClick={handleIncrease}
                            disabled={!hasStock || quantity >= maximumQuantity}
                            aria-label={t('product.increaseQuantity')}
                        >
                            +
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    className={`${styles.cartButton} ${
                        isAddedToCart ? styles.cartButtonSuccess : ''
                    }`}
                    disabled={!canAddToCart}
                    onClick={handleAddToCart}
                >
                    {addToCartLabel}
                </button>

                {isAddedToCart && (
                    <Link to="/cart" className={styles.cartButtonSecondary}>
                        {t('product.goToCart')}
                    </Link>
                )}
            </div>

            <div className={styles.mobilePurchase}>
                <div>
                    <span>{t('product.price')}</span>

                    <strong>{formatCurrency(price, currency)}</strong>
                </div>

                <div className={styles.mobilePurchaseActions}>
                    <button
                        type="button"
                        className={
                            isAddedToCart ? styles.mobileCartButtonSuccess : ''
                        }
                        disabled={!canAddToCart}
                        onClick={handleAddToCart}
                    >
                        {addToCartLabel}
                    </button>

                    {isAddedToCart && (
                        <Link to="/cart" className={styles.cartButtonSecondary}>
                            {t('product.goToCart')}
                        </Link>
                    )}
                </div>
            </div>
        </aside>
    );
};
