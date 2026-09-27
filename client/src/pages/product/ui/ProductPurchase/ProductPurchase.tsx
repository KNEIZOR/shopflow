import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/entities/auth';
import type { Product, ProductVariant } from '@/entities/product';
import { useAddToCart } from '@/features/add-to-cart';
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

type VariantAttributeGroup = {
    attributeId: string;
    name: string;
    slug: string;
    values: string[];
};

const getVariantAttributeGroups = (
    variants: ProductVariant[],
): VariantAttributeGroup[] => {
    const groups = new Map<
        string,
        {
            attributeId: string;
            name: string;
            slug: string;
            values: Set<string>;
        }
    >();

    for (const variant of variants) {
        for (const attribute of variant.attributes) {
            const existingGroup = groups.get(attribute.attributeId);

            if (existingGroup) {
                existingGroup.values.add(attribute.value);
                continue;
            }

            groups.set(attribute.attributeId, {
                attributeId: attribute.attributeId,
                name: attribute.attribute.name,
                slug: attribute.attribute.slug,
                values: new Set([attribute.value]),
            });
        }
    }

    return Array.from(groups.values()).map((group) => ({
        attributeId: group.attributeId,
        name: group.name,
        slug: group.slug,
        values: Array.from(group.values),
    }));
};

const getVariantAttributeValue = (
    variant: ProductVariant,
    attributeId: string,
): string | null => {
    return (
        variant.attributes.find(
            (attribute) => attribute.attributeId === attributeId,
        )?.value ?? null
    );
};

const variantMatchesAttributeSelection = (
    variant: ProductVariant,
    selection: Map<string, string>,
): boolean => {
    for (const [attributeId, value] of selection) {
        if (getVariantAttributeValue(variant, attributeId) !== value) {
            return false;
        }
    }

    return true;
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

    const attributeGroups = useMemo(
        () => getVariantAttributeGroups(product.variants),
        [product.variants],
    );

    const hasVariantAttributes = attributeGroups.length > 0;

    const selectedAttributeValues = useMemo(() => {
        const selection = new Map<string, string>();

        if (!selectedVariant) {
            return selection;
        }

        for (const attribute of selectedVariant.attributes) {
            selection.set(attribute.attributeId, attribute.value);
        }

        return selection;
    }, [selectedVariant]);

    const getAvailableVariantForAttributeValue = (
        attributeId: string,
        value: string,
    ): ProductVariant | null => {
        const nextSelection = new Map(selectedAttributeValues);

        nextSelection.set(attributeId, value);

        const exactMatch = product.variants.find((variant) => {
            if (variant.stock <= 0) {
                return false;
            }

            return variantMatchesAttributeSelection(variant, nextSelection);
        });

        if (exactMatch) {
            return exactMatch;
        }

        return (
            product.variants.find((variant) => {
                if (variant.stock <= 0) {
                    return false;
                }

                return getVariantAttributeValue(variant, attributeId) === value;
            }) ?? null
        );
    };

    const isAttributeValueAvailable = (attributeId: string, value: string) => {
        return Boolean(
            getAvailableVariantForAttributeValue(attributeId, value),
        );
    };

    const handleAttributeChange = (attributeId: string, value: string) => {
        const nextVariant = getAvailableVariantForAttributeValue(
            attributeId,
            value,
        );

        if (!nextVariant) {
            return;
        }

        onVariantChange(nextVariant.id);
    };

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

                    {hasVariantAttributes ? (
                        <div className={styles.attributeGroups}>
                            {attributeGroups.map((group) => {
                                const selectedValue =
                                    selectedAttributeValues.get(
                                        group.attributeId,
                                    ) ?? null;

                                return (
                                    <div
                                        className={styles.attributeGroup}
                                        key={group.attributeId}
                                    >
                                        <div
                                            className={
                                                styles.attributeGroupHeader
                                            }
                                        >
                                            <span
                                                className={styles.attributeName}
                                            >
                                                {group.name}
                                            </span>

                                            {selectedValue && (
                                                <span
                                                    className={
                                                        styles.attributeSelected
                                                    }
                                                >
                                                    {selectedValue}
                                                </span>
                                            )}
                                        </div>

                                        <div
                                            className={styles.attributeOptions}
                                        >
                                            {group.values.map((value) => {
                                                const isSelected =
                                                    selectedValue === value;

                                                const isAvailable =
                                                    isAttributeValueAvailable(
                                                        group.attributeId,
                                                        value,
                                                    );

                                                return (
                                                    <button
                                                        key={`${group.attributeId}-${value}`}
                                                        type="button"
                                                        className={`${
                                                            styles.attributeOption
                                                        } ${
                                                            isSelected
                                                                ? styles.attributeOptionActive
                                                                : ''
                                                        } ${
                                                            !isAvailable
                                                                ? styles.attributeOptionDisabled
                                                                : ''
                                                        }`}
                                                        disabled={!isAvailable}
                                                        aria-pressed={
                                                            isSelected
                                                        }
                                                        onClick={() =>
                                                            handleAttributeChange(
                                                                group.attributeId,
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        {value}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.variantGrid}>
                            {product.variants.map((variant) => {
                                const isSelected =
                                    variant.id === selectedVariantId;
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
                                        onClick={() =>
                                            onVariantChange(variant.id)
                                        }
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
                    )}
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
