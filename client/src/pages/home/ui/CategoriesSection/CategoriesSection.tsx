import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useCategories } from '@/entities/category';
import { useLocale } from '@/entities/locale';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';

import styles from './CategoriesSection.module.scss';

const MAX_FEATURED_CATEGORIES = 6;
const CARD_REVEAL_DELAY = 80;

const getCategoryInitial = (name: string): string => {
    return name.trim().charAt(0).toUpperCase();
};

export const CategoriesSection = () => {
    const { t } = useTranslation();
    const { language } = useLocale();

    const {
        data: categories = [],
        isLoading,
        isError,
    } = useCategories(language);

    const visibleCategories = categories.slice(0, MAX_FEATURED_CATEGORIES);

    const showSkeleton = isLoading && categories.length === 0;

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.heading}>
                        <ScrollReveal animation="fade-up">
                            <p className={styles.eyebrow}>
                                <span
                                    className={styles.eyebrowLine}
                                    aria-hidden="true"
                                />

                                {t('home.categories.eyebrow')}
                            </p>
                        </ScrollReveal>

                        <ScrollReveal
                            animation="fade-up"
                            delay={80}
                            duration={800}
                        >
                            <h2 className={styles.title}>
                                {t('home.categories.title')}
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal
                            animation="fade-up"
                            delay={160}
                            duration={800}
                        >
                            <p className={styles.description}>
                                {t('home.categories.description')}
                            </p>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal
                        animation="fade-left"
                        delay={180}
                        duration={800}
                    >
                        <Link to="/catalog" className={styles.allLink}>
                            <span>{t('home.categories.viewAll')}</span>

                            <span
                                className={styles.allLinkArrow}
                                aria-hidden="true"
                            >
                                →
                            </span>
                        </Link>
                    </ScrollReveal>
                </div>

                {showSkeleton ? (
                    <div className={styles.grid} aria-hidden="true">
                        {Array.from(
                            {
                                length: MAX_FEATURED_CATEGORIES,
                            },
                            (_, index) => (
                                <div
                                    key={index}
                                    className={styles.skeletonCard}
                                >
                                    <div className={styles.skeletonImage} />

                                    <div className={styles.skeletonContent}>
                                        <span className={styles.skeletonLine} />

                                        <span
                                            className={styles.skeletonLineShort}
                                        />
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                ) : isError ? (
                    <ScrollReveal animation="fade-up" delay={100}>
                        <div className={styles.state}>
                            <span className={styles.stateIcon}>!</span>

                            <p>{t('common.error')}</p>
                        </div>
                    </ScrollReveal>
                ) : visibleCategories.length === 0 ? (
                    <ScrollReveal animation="fade-up" delay={100}>
                        <div className={styles.state}>
                            <span className={styles.stateIcon}>—</span>

                            <p>{t('home.categories.empty')}</p>
                        </div>
                    </ScrollReveal>
                ) : (
                    <div className={styles.grid}>
                        {visibleCategories.map((category, index) => (
                            <ScrollReveal
                                key={category.id}
                                animation="fade-up"
                                delay={index * CARD_REVEAL_DELAY}
                                duration={800}
                            >
                                <Link
                                    to={`/catalog?category=${encodeURIComponent(
                                        category.slug,
                                    )}`}
                                    className={styles.card}
                                >
                                    <div className={styles.imageWrapper}>
                                        {category.imageUrl ? (
                                            <img
                                                src={category.imageUrl}
                                                alt={category.name}
                                                className={styles.image}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div
                                                className={styles.fallback}
                                                aria-hidden="true"
                                            >
                                                <span>
                                                    {getCategoryInitial(
                                                        category.name,
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        <div
                                            className={styles.imageOverlay}
                                            aria-hidden="true"
                                        />

                                        <span className={styles.number}>
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        <span
                                            className={styles.cardArrow}
                                            aria-hidden="true"
                                        >
                                            →
                                        </span>
                                    </div>

                                    <div className={styles.cardContent}>
                                        <div>
                                            <h3 className={styles.cardTitle}>
                                                {category.name}
                                            </h3>

                                            {category.description && (
                                                <p
                                                    className={
                                                        styles.cardDescription
                                                    }
                                                >
                                                    {category.description}
                                                </p>
                                            )}
                                        </div>

                                        <span className={styles.explore}>
                                            {t('home.categories.explore')}
                                        </span>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
