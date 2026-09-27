import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useFavorites } from '@/entities/favorite';

import styles from './FavoritesPage.module.scss';

export const FavoritesPage = () => {
    const { t, i18n } = useTranslation();

    const language = i18n.language === 'ru' ? 'ru' : 'en';

    const {
        data: favorites = [],
        isLoading,
        isError,
        refetch,
    } = useFavorites({
        language,
        currency: 'RUB',
    });

    if (isLoading) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.state}>
                        <span className={styles.stateLabel}>
                            {t('favorites.page.loading')}
                        </span>
                    </div>
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.state}>
                        <p className={styles.stateLabel}>
                            {t('favorites.page.error')}
                        </p>

                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={() => void refetch()}
                        >
                            {t('favorites.page.retry')}
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div>
                        <p className={styles.eyebrow}>
                            {t('favorites.page.eyebrow')}
                        </p>

                        <h1 className={styles.title}>
                            {t('favorites.page.title')}
                        </h1>

                        <p className={styles.description}>
                            {t('favorites.page.description')}
                        </p>
                    </div>

                    {favorites.length > 0 && (
                        <span className={styles.count}>{favorites.length}</span>
                    )}
                </header>

                {favorites.length === 0 ? (
                    <section className={styles.empty}>
                        <div className={styles.emptyIcon}>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
                            </svg>
                        </div>

                        <h2 className={styles.emptyTitle}>
                            {t('favorites.page.empty')}
                        </h2>

                        <p className={styles.emptyDescription}>
                            {t('favorites.page.emptyDescription')}
                        </p>

                        <Link to="/catalog" className={styles.primaryButton}>
                            {t('favorites.page.continueShopping')}
                        </Link>
                    </section>
                ) : (
                    <section className={styles.grid}>
                        {favorites.map((favorite) => (
                            <article key={favorite.id} className={styles.card}>
                                <Link
                                    to={`/product/${favorite.product.slug}`}
                                    className={styles.imageLink}
                                >
                                    <div className={styles.imageWrapper}>
                                        {favorite.product.images[0] ? (
                                            <img
                                                src={
                                                    favorite.product.images[0]
                                                        .url
                                                }
                                                alt={
                                                    favorite.product.images[0]
                                                        .alt ??
                                                    favorite.product.name
                                                }
                                                className={styles.image}
                                            />
                                        ) : (
                                            <div className={styles.placeholder}>
                                                {t('product.noImage')}
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                <div className={styles.content}>
                                    <span className={styles.category}>
                                        {favorite.product.category.name}
                                    </span>

                                    <Link
                                        to={`/product/${favorite.product.slug}`}
                                        className={styles.name}
                                    >
                                        {favorite.product.name}
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
};
