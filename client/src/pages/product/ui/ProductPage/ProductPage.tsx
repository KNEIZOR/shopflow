import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useProduct } from '../../model/useProduct';

import { ProductAttributes } from '../ProductAttributes';
import { ProductDescription } from '../ProductDescription';
import { ProductGallery } from '../ProductGallery';
import { ProductPurchase } from '../ProductPurchase';

import styles from './ProductPage.module.scss';

export const ProductPage = () => {
    const { t } = useTranslation();

    const { data: product, isLoading, isError } = useProduct();

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
        null,
    );
    const [quantity, setQuantity] = useState(1);

    const selectedVariant = useMemo(() => {
        if (!product || product.variants.length === 0) {
            return null;
        }

        if (selectedVariantId) {
            return (
                product.variants.find(
                    (variant) => variant.id === selectedVariantId,
                ) ?? product.variants[0]
            );
        }

        return product.variants[0];
    }, [product, selectedVariantId]);

    if (isLoading) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.state}>
                        <span className={styles.stateIndicator} />
                        <p>{t('product.loading')}</p>
                    </div>
                </div>
            </main>
        );
    }

    if (isError || !product) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.state}>
                        <p>{t('product.error')}</p>

                        <Link to="/catalog" className={styles.backLink}>
                            {t('product.backToCatalog')}
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const activeVariant = selectedVariant;

    const currentPrice = activeVariant?.price ?? product.price;
    const currentCurrency = activeVariant?.currency ?? product.currency;

    const currentStock = activeVariant
        ? activeVariant.stock
        : product.status === 'ACTIVE'
          ? null
          : 0;

    const hasStock = currentStock === null || currentStock > 0;

    const safeImageIndex =
        product.images.length > 0
            ? Math.min(activeImageIndex, product.images.length - 1)
            : 0;

    const handleVariantChange = (variantId: string) => {
        setSelectedVariantId(variantId);

        const variant = product.variants.find((item) => item.id === variantId);

        if (variant && variant.stock > 0) {
            setQuantity((currentQuantity) =>
                Math.min(currentQuantity, variant.stock),
            );
        }
    };

    const handleQuantityChange = (nextQuantity: number) => {
        const maximum = currentStock ?? 99;

        setQuantity(Math.max(1, Math.min(nextQuantity, maximum)));
    };

    return (
        <main className={styles.page}>
            <div className="container">
                <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                    <Link to="/">{t('product.home')}</Link>

                    <span>/</span>

                    <Link to="/catalog">{t('product.catalog')}</Link>

                    <span>/</span>

                    <Link to={`/catalog?category=${product.category.slug}`}>
                        {product.category.name}
                    </Link>

                    <span>/</span>

                    <span className={styles.currentBreadcrumb}>
                        {product.name}
                    </span>
                </nav>

                <section className={styles.product}>
                    <ProductGallery
                        productName={product.name}
                        images={product.images}
                        activeImageIndex={safeImageIndex}
                        onImageChange={setActiveImageIndex}
                    />

                    <ProductPurchase
                        product={product}
                        selectedVariant={activeVariant}
                        selectedVariantId={activeVariant?.id ?? null}
                        quantity={quantity}
                        price={currentPrice}
                        currency={currentCurrency}
                        stock={currentStock}
                        hasStock={hasStock}
                        onVariantChange={handleVariantChange}
                        onQuantityChange={handleQuantityChange}
                    />
                </section>

                <div className={styles.lowerContent}>
                    <ProductAttributes product={product} />

                    <ProductDescription description={product.description} />
                </div>
            </div>
        </main>
    );
};
