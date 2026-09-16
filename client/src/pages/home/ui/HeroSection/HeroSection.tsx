import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useCatalog } from '@/pages/catalog/model/useCatalog';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';

import styles from './HeroSection.module.scss';

const HERO_STATS = [
    {
        value: '1000+',
        key: 'products',
    },
    {
        value: '24/7',
        key: 'support',
    },
    {
        value: '100%',
        key: 'secure',
    },
] as const;

const HERO_PRODUCT_CARDS = [
    {
        id: 'featured',
        className: 'primary',
        labelKey: 'featured',
    },
    {
        id: 'popular',
        className: 'secondary',
        labelKey: 'popular',
    },
] as const;

const getProductImage = (
    images: {
        url: string;
        alt: string | null;
        position: number;
    }[],
) => {
    if (!images.length) {
        return null;
    }

    return (
        [...images].sort(
            (first, second) => first.position - second.position,
        )[0] ?? null
    );
};

export const HeroSection = () => {
    const { t } = useTranslation();

    const { data, isLoading } = useCatalog({
        page: 1,
        limit: HERO_PRODUCT_CARDS.length,
        sort: 'newest',
    });

    const products = data?.items ?? [];

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.hero}>
                    <div className={styles.content}>
                        <ScrollReveal animation="fade-up" duration={700}>
                            <p className={styles.eyebrow}>
                                <span
                                    className={styles.eyebrowLine}
                                    aria-hidden="true"
                                />

                                {t('home.eyebrow')}
                            </p>
                        </ScrollReveal>

                        <ScrollReveal
                            animation="fade-up"
                            delay={90}
                            duration={900}
                        >
                            <h1 className={styles.title}>{t('home.title')}</h1>
                        </ScrollReveal>

                        <ScrollReveal
                            animation="fade-up"
                            delay={180}
                            duration={800}
                        >
                            <p className={styles.description}>
                                {t('home.description')}
                            </p>
                        </ScrollReveal>

                        <ScrollReveal
                            animation="fade-up"
                            delay={270}
                            duration={800}
                        >
                            <div className={styles.actions}>
                                <Link
                                    to="/catalog"
                                    className={styles.primaryButton}
                                >
                                    <span>{t('home.catalogButton')}</span>

                                    <span
                                        className={styles.buttonArrow}
                                        aria-hidden="true"
                                    >
                                        →
                                    </span>
                                </Link>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal
                            animation="fade-up"
                            delay={360}
                            duration={800}
                        >
                            <div className={styles.stats}>
                                {HERO_STATS.map((stat, index) => (
                                    <div
                                        key={stat.key}
                                        className={styles.stat}
                                        style={
                                            {
                                                '--stat-index': index,
                                            } as React.CSSProperties
                                        }
                                    >
                                        <strong className={styles.statValue}>
                                            {stat.value}
                                        </strong>

                                        <span className={styles.statLabel}>
                                            {t(`home.stats.${stat.key}`)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>

                    <div
                        className={styles.visual}
                        aria-label={t('home.heroProductsLabel')}
                    >
                        <div
                            className={styles.visualNoise}
                            aria-hidden="true"
                        />

                        <div className={styles.visualGlow} aria-hidden="true" />

                        <div className={styles.visualRing} aria-hidden="true" />

                        <div
                            className={styles.visualRingSmall}
                            aria-hidden="true"
                        />

                        <span
                            className={styles.decorDotOne}
                            aria-hidden="true"
                        />

                        <span
                            className={styles.decorDotTwo}
                            aria-hidden="true"
                        />

                        <span
                            className={styles.decorDotThree}
                            aria-hidden="true"
                        />

                        <div className={styles.visualHeader}>
                            <span
                                className={styles.visualDot}
                                aria-hidden="true"
                            />

                            <span className={styles.visualLabel}>ShopFlow</span>

                            <span
                                className={styles.visualHeaderLine}
                                aria-hidden="true"
                            />
                        </div>

                        <div className={styles.cards}>
                            {HERO_PRODUCT_CARDS.map((card, index) => {
                                const product = products[index];

                                const image = product
                                    ? getProductImage(product.images)
                                    : null;

                                const cardTitle =
                                    product?.name ??
                                    t(`home.cards.${card.labelKey}`);

                                const cardHref = product
                                    ? `/product/${product.slug}`
                                    : '/catalog';

                                return (
                                    <Link
                                        key={card.id}
                                        to={cardHref}
                                        className={`${styles.productCard} ${styles[card.className]}`}
                                    >
                                        <span className={styles.cardLabel}>
                                            {t(`home.cards.${card.labelKey}`)}
                                        </span>

                                        <div className={styles.productVisual}>
                                            {isLoading ? (
                                                <div
                                                    className={
                                                        styles.imageSkeleton
                                                    }
                                                    aria-hidden="true"
                                                />
                                            ) : image ? (
                                                <img
                                                    src={image.url}
                                                    alt={image.alt ?? cardTitle}
                                                    className={
                                                        styles.productImage
                                                    }
                                                />
                                            ) : (
                                                <span
                                                    className={
                                                        styles.productFallback
                                                    }
                                                    aria-hidden="true"
                                                >
                                                    <span
                                                        className={
                                                            styles.productCamera
                                                        }
                                                    />

                                                    <span
                                                        className={
                                                            styles.productScreen
                                                        }
                                                    />
                                                </span>
                                            )}
                                        </div>

                                        <div className={styles.cardInfo}>
                                            <strong title={cardTitle}>
                                                {cardTitle}
                                            </strong>

                                            <span>
                                                {product
                                                    ? `${product.price} ${product.currency}`
                                                    : t(
                                                          'home.cards.priceUnavailable',
                                                      )}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className={styles.visualFooter} aria-hidden="true">
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
