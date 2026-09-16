import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useCatalog } from '@/pages/catalog/model/useCatalog';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';

import styles from './NewProductsSection.module.scss';

const PRODUCTS_LIMIT = 4;
const PRODUCT_REVEAL_DELAY = 90;

export const NewProductsSection = () => {
    const { t } = useTranslation();

    const { data, isLoading, isError } = useCatalog({
        limit: PRODUCTS_LIMIT,
        sort: 'newest',
    });

    const products = data?.items ?? [];

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <ScrollReveal animation="fade-up" duration={750}>
                        <div>
                            <p className={styles.eyebrow}>
                                {t('home.newProducts.eyebrow')}
                            </p>

                            <h2 className={styles.title}>
                                {t('home.newProducts.title')}
                            </h2>

                            <p className={styles.description}>
                                {t('home.newProducts.description')}
                            </p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal
                        animation="fade-left"
                        delay={120}
                        duration={750}
                    >
                        <Link to="/catalog" className={styles.allLink}>
                            {t('home.newProducts.viewAll')}

                            <span aria-hidden="true">→</span>
                        </Link>
                    </ScrollReveal>
                </div>

                {isLoading && (
                    <ScrollReveal animation="fade-up">
                        <div className={styles.state}>
                            <p>{t('home.newProducts.loading')}</p>
                        </div>
                    </ScrollReveal>
                )}

                {isError && !isLoading && (
                    <ScrollReveal animation="fade-up">
                        <div className={styles.state}>
                            <p>{t('home.newProducts.error')}</p>
                        </div>
                    </ScrollReveal>
                )}

                {!isLoading && !isError && products.length === 0 && (
                    <ScrollReveal animation="fade-up">
                        <div className={styles.state}>
                            <p>{t('home.newProducts.empty')}</p>
                        </div>
                    </ScrollReveal>
                )}

                {!isLoading && !isError && products.length > 0 && (
                    <div className={styles.grid}>
                        {products.map((product, index) => {
                            const image = product.images[0];

                            return (
                                <ScrollReveal
                                    key={product.id}
                                    animation="fade-up"
                                    delay={index * PRODUCT_REVEAL_DELAY}
                                    duration={800}
                                >
                                    <Link
                                        to={`/product/${encodeURIComponent(
                                            product.slug,
                                        )}`}
                                        className={styles.card}
                                    >
                                        <div className={styles.imageWrapper}>
                                            {image ? (
                                                <img
                                                    className={styles.image}
                                                    src={image.url}
                                                    alt={
                                                        image.alt ??
                                                        product.name
                                                    }
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className={styles.noImage}>
                                                    {t('product.noImage')}
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles.info}>
                                            <div className={styles.category}>
                                                {product.category.name}
                                            </div>

                                            <h3 className={styles.name}>
                                                {product.name}
                                            </h3>

                                            <div className={styles.footer}>
                                                <strong
                                                    className={styles.price}
                                                >
                                                    {product.price}{' '}
                                                    {product.currency}
                                                </strong>

                                                <span
                                                    className={styles.arrow}
                                                    aria-hidden="true"
                                                >
                                                    →
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};
